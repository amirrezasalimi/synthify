/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x4szptjmsaa967c")

  collection.indexes = [
    "CREATE INDEX `idx_zT5gSgD` ON `user_ai` (`user`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x4szptjmsaa967c")

  collection.indexes = []

  return dao.saveCollection(collection)
})
