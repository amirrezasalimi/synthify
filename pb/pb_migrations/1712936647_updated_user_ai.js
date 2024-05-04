/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x4szptjmsaa967c")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zfrdsve6",
    "name": "add_by",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "system",
        "user"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x4szptjmsaa967c")

  // remove
  collection.schema.removeField("zfrdsve6")

  return dao.saveCollection(collection)
})
