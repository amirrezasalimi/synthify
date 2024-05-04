/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cmcqgdeuxkacqlt")

  collection.name = "ai_usages"

  // remove
  collection.schema.removeField("mba5wmqa")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ashjxac6",
    "name": "service_name",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "f8xfnaey",
    "name": "tokens_count",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ziw7ger0",
    "name": "model_id",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cmcqgdeuxkacqlt")

  collection.name = "user_usages"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mba5wmqa",
    "name": "token_count",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // remove
  collection.schema.removeField("ashjxac6")

  // remove
  collection.schema.removeField("f8xfnaey")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ziw7ger0",
    "name": "model_name",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
