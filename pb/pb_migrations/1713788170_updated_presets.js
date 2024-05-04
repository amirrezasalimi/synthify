/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p1j0s1cvm0ylddr")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rmwfwuqe",
    "name": "category",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Question Answer",
        "Function Calling",
        "Json Extraction"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p1j0s1cvm0ylddr")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rmwfwuqe",
    "name": "category",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Question Answer",
        "Function Calling"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
