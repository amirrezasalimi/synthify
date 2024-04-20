/// <reference path="../pb_data/types.d.ts" />

onRecordBeforeAuthWithPasswordRequest((e) => {
  const isExternalUser = e.record.getBool("external");

  if (!isExternalUser) {
    return true;
  }
  // get external_auth_secret from db
  const config_res = $app
    .dao()
    .findRecordsByFilter("config", `key = "external_auth_secret"`);
  if (config_res?.[0]) {
    const config_external_auth_secret = config_res[0].get("value");

    let external_auth_secret;

    try {
      external_auth_secret = e.httpContext.queryParam("external_auth_secret");
    } catch (e) {
      return c.json(401, { message: "external_auth_secret param required" });
    }
    // check
    if (external_auth_secret !== config_external_auth_secret) {
      return c.json(401, { message: "external_auth_secret invalid" });
    }
  }
});
