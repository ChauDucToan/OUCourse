async function request(url) {
  try {
    const respone = await fetch(url);
    console.log(respone);
    const result = await respone.json();
    return result;
  } catch (e) {
    console.error(`Lỗi request ${url}`, e);
  }
}
export default request;
