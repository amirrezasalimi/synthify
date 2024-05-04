/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cmcqgdeuxkacqlt")

  // remove
  collection.schema.removeField("qlqubvec")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jbxj9wlz",
    "name": "entity_type",
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
    "id": "biyovqh2",
    "name": "entity_id",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qlqubvec",
    "name": "task",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "o9ef5oes2vz6dng",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("jbxj9wlz")

  // remove
  collection.schema.removeField("biyovqh2")

  return dao.saveCollection(collection)
})
