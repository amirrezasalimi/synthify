/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "p1j0s1cvm0ylddr",
    "created": "2024-04-20 00:18:40.128Z",
    "updated": "2024-04-20 00:18:40.128Z",
    "name": "presets",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "lvjq8bsm",
        "name": "data",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      }
    ],
    "indexes": [],
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
  const collection = dao.findCollectionByNameOrId("p1j0s1cvm0ylddr");

  return dao.deleteCollection(collection);
})
