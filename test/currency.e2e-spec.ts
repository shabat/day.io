import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CURRENCY_DETAILS } from '../src/currency/constants/supported-currencies';
import { ConversionType } from '../src/currency/constants';

describe('CurrencyController (e2e)', () => {
  let app: INestApplication;
  const mockRates = [
    {
      currencyCodeA: 840, // USD
      currencyCodeB: 980, // UAH
      date: 1699006740,
      rateBuy: 36.65,
      rateSell: 37.4406,
    },
    {
      currencyCodeA: 978, // EUR
      currencyCodeB: 980, // UAH
      date: 1699006740,
      rateBuy: 39.05,
      rateSell: 39.95,
    },
    {
      currencyCodeA: 978, // EUR
      currencyCodeB: 840, // USD
      date: 1699006740,
      rateCross: 1.0631,
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('MonobankService')
      .useValue({
        fetchRates: jest.fn().mockResolvedValue(mockRates),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  describe('/currency/supported (GET)', () => {
    it('should return list of supported currencies', () => {
      return request(app.getHttpServer())
        .get('/currency/supported')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body).toEqual(CURRENCY_DETAILS);

          // Check specific currency details
          expect(res.body.USD).toBeDefined();
          expect(res.body.USD.name).toBe('US Dollar');
          expect(res.body.USD.number).toBe('840');
          expect(res.body.USD.code).toBe('USD');
        });
    });

    it('should cache the response', async () => {
      // First request
      await request(app.getHttpServer()).get('/currency/supported').expect(200);

      // Second request should use cached data
      await request(app.getHttpServer())
        .get('/currency/supported')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(CURRENCY_DETAILS);
        });
    });
  });

  describe('/currency/convert (POST)', () => {
    it('should convert USD to UAH using sell rate', () => {
      const amount = 100;
      return request(app.getHttpServer())
        .post('/currency/convert')
        .send({
          sourceCurrency: 'USD',
          targetCurrency: 'UAH',
          amount,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            sourceCurrency: 'USD',
            targetCurrency: 'UAH',
            sourceInfo: 'US Dollar',
            targetInfo: 'Hryvnia',
            conversionType: ConversionType.BUY_SELL,
          });
          expect(res.body.amount).toEqual(res.body.rate * amount);
          expect(res.body.timestamp).toBeDefined();
        });
    });

    it('should convert UAH to USD using buy rate', () => {
      const amount = 1000;

      return request(app.getHttpServer())
        .post('/currency/convert')
        .send({
          sourceCurrency: 'UAH',
          targetCurrency: 'USD',
          amount: 1000,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            sourceCurrency: 'UAH',
            targetCurrency: 'USD',
            sourceInfo: 'Hryvnia',
            targetInfo: 'US Dollar',
            conversionType: ConversionType.BUY_SELL,
          });
          expect(res.body.amount).toEqual(res.body.rate * amount);
          expect(res.body.timestamp).toBeDefined();
        });
    });

    it('should convert EUR to USD using cross rate', () => {
      const amount = 100;

      return request(app.getHttpServer())
        .post('/currency/convert')
        .send({
          sourceCurrency: 'EUR',
          targetCurrency: 'USD',
          amount,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            sourceCurrency: 'EUR',
            targetCurrency: 'USD',
            sourceInfo: 'Euro',
            targetInfo: 'US Dollar',
            conversionType: ConversionType.CROSS,
          });
          expect(res.body.amount).toEqual(res.body.rate * amount);
          expect(res.body.timestamp).toBeDefined();
        });
    });

    it('should convert same currency with rate 1', () => {
      const amount = 100;

      return request(app.getHttpServer())
        .post('/currency/convert')
        .send({
          sourceCurrency: 'USD',
          targetCurrency: 'USD',
          amount,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            amount,
            sourceCurrency: 'USD',
            targetCurrency: 'USD',
            sourceInfo: 'US Dollar',
            targetInfo: 'US Dollar',
            rate: 1,
            conversionType: ConversionType.SAME_CURRENCY,
          });
        });
    });

    it('should handle cross conversion through UAH', () => {
      const amount = 100;
      return request(app.getHttpServer())
        .post('/currency/convert')
        .send({
          sourceCurrency: 'USD',
          targetCurrency: 'EUR',
          amount,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            sourceCurrency: 'USD',
            targetCurrency: 'EUR',
            sourceInfo: 'US Dollar',
            targetInfo: 'Euro',
            conversionType: ConversionType.CROSS,
          });
          expect(res.body.rate).toBeCloseTo(0.9, 1);
        });
    });

    describe('Error cases', () => {
      it('should reject negative amount', () => {
        return request(app.getHttpServer())
          .post('/currency/convert')
          .send({
            sourceCurrency: 'USD',
            targetCurrency: 'UAH',
            amount: -100,
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message[0]).toBe(
              'amount must be a positive number',
            );
          });
      });

      it('should reject invalid currency code', () => {
        return request(app.getHttpServer())
          .post('/currency/convert')
          .send({
            sourceCurrency: 'INVALID',
            targetCurrency: 'UAH',
            amount: 100,
          })
          .expect(400);
      });

      it('should validate required fields', () => {
        return request(app.getHttpServer())
          .post('/currency/convert')
          .send({
            sourceCurrency: 'USD',
            // missing targetCurrency
            amount: 100,
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message[0]).toEqual(
              'targetCurrency should not be empty',
            );
          });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
