const categoriesHandler = require("../index.js");
const secondCategoriesHandler = require("../index.js");
const tasksHandler = require("../index.js");
const tasksCategoryHandler = require("../index.js");
const taskerCategoriesHandler = require("../index.js");
const taskerNameHandler = require("../index.js");
const checkoutNameHandler = require("../index.js");
const usersHandler = require("../index.js");

describe('Test Handlers', function () {
    
    test('responds to /', () => {
        const req = {  };

        const res = { object: {},
            send: function(input) { this.object = input } 
        };
        categoriesHandler(req, res);
        
        expect(res.object).toEqual({});
    });

    test('responds to /tasks', () => {
        const req = {  };

        const res = { object: {},
            send: function(input) { this.object = input } 
        };
        tasksHandler(req, res);
        
        expect(res.object).toEqual({});
    });

    test('responds to /categories', () => {
        const req = {  };

        const res = { object: {},
            send: function(input) { this.object = input } 
        };
        secondCategoriesHandler(req, res);
        
        expect(res.object).toEqual({});
    });

    test('responds to /tasks:categories', () => {
        const req = {  };

        const res = { object: {},
            send: function(input) { this.object = input } 
        };
        tasksCategoryHandler(req, res);
        
        expect(res.object).toEqual({});
    });

    test('responds to /taskers/:category/:task', () => {
        const req = {  };

        const res = { object: {},
            send: function(input) { this.object = input } 
        };
        taskerCategoriesHandler(req, res);
        
        expect(res.object).toEqual({});
    });

    test('responds to /tasker/:name/:task', () => {
        const req = {  };

        const res = { object: {},
            send: function(input) { this.object = input } 
        };
        taskerNameHandler(req, res);
        
        expect(res.object).toEqual({});
    });

    test('responds to /tasker/:name/:task', () => {
        const req = {  };

        const res = { object: {},
            send: function(input) { this.object = input } 
        };
        checkoutNameHandler(req, res);
        
        expect(res.object).toEqual({});
    });

    test('responds to /users', () => {
        const req = {  };

        const res = { object: {},
            send: function(input) { this.object = input } 
        };
        usersHandler(req, res);
        
        expect(res.object).toEqual({});
    });
});