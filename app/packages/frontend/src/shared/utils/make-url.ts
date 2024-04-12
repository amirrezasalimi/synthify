const makeUrl = (path: string, params: any) => {
  let url = path;
  for (const key in params) {
    url = url.replace(`:${key}`, params[key]);
    url = url.replace(`{${key}}`, params[key]);
  }
  return url;
};


export default makeUrl;