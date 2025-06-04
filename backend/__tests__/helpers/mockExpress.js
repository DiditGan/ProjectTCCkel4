function mockRequest(body = {}, params = {}, query = {}, userId = null, file = null) {
  return {
    body,
    params,
    query,
    userId,
    file,
    headers: {},
  };
}

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

module.exports = { mockRequest, mockResponse };
