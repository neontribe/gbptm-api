const request = require('supertest');
const app = require('../app');
const Loo = require('../models/loo');
const mongoose = require('mongoose');
const looRadius = require('./data/looRadius.js');

describe('loo routes (public)', () => {
  describe('loos/near/:lon/:lat', () => {
    beforeAll(async () => {
      await Loo.collection.insertMany(looRadius);
    });

    it('should return a limit of 5 loos for -0.2068223/51.518342', async () => {
      const response = await request(app).get(
        '/loos/near/-0.2068223/51.518342/'
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.features.length).toBe(5);
    });

    it('should return 20 loos for -0.2068223/51.518342', async () => {
      const response = await request(app).get(
        '/loos/near/-0.2068223/51.518342/?limit=20'
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.features.length).toBe(20);
    });

    it('should return 0 loos for 51.518342/-0.2068223', async () => {
      const response = await request(app).get(
        '/loos/near/51.518342/-0.2068223'
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.features.length).toBe(0);
    });

    /**
     * OH GOD WHAT DO WE HAVE TO DO HERE TO MAKE IT STOP?
     */
    afterAll(async () => {
      await Loo.remove({}).exec();
      await Loo.db.close();
      await mongoose.connection.close();
    });
  });

  // describe('loos/in/:sw/:ne/:nw/:se', () => {
  //   beforeAll(async () => {
  //     await Loo.collection.insertMany(looRadius);
  //   });

  //   it('should return 12 loos', async () => {
  //     const response = await request(app).get(
  //       '/loos/in/-24.2,44.5/20.3,60.4/-24.2,60.4/20.3,44.5'
  //     );
  //     expect(response.statusCode).toBe(200);
  //     expect(response.body.features.length).toBe(12);
  //   });

  //   /**
  //    * OH GOD WHAT DO WE HAVE TO DO HERE TO MAKE IT STOP?
  //    */
  //   afterAll(async () => {
  //     await Loo.remove({}).exec();
  //     await Loo.db.close();
  //     await mongoose.connection.close();
  //   });
  // });
});
