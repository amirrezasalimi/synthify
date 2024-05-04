/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "2rgxt4ou15idv92",
    "created": "2024-04-20 01:27:16.620Z",
    "updated": "2024-04-20 01:27:16.620Z",
    "name": "external_users",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "u7cnok7l",
        "name": "user",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "izyll4eg",
        "name": "external_user_id",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "iduchmhv",
        "name": "referral",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `idx_HNCdUwW` ON `external_users` (`user`)",
      "CREATE INDEX `idx_nvxcZZw` ON `external_users` (`referral`)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("2rgxt4ou15idv92");

  return dao.deleteCollection(collection);
})
