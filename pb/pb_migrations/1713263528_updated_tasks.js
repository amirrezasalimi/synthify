/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o9ef5oes2vz6dng")

  collection.indexes = [
    "CREATE INDEX `idx_zduoD7V` ON `tasks` (`project`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o9ef5oes2vz6dng")

  collection.indexes = []

  return dao.saveCollection(collection)
})
