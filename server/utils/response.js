'use strict';

var _ = require('lodash');

var _isSerializableAndObject = function(data){
  return typeof data === 'object';
};

var _isSerializableAndNotObject = function(data){
  return _.contains(['string', 'number', 'boolean'], typeof data);
};

var _payload = function(data){
  if (_.isError(data)){
    return { error: data.toString() };
  } else if (_isSerializableAndObject(data)){
    return data;
  } else if (_isSerializableAndNotObject(data)){
    return { message: data };
  } else {
    return {};
  }
};

var _newResponse = function(statusCode){
  return function(httpResponse){
    return function(data){
      httpResponse.status(statusCode);
      httpResponse.type('application/json');
      httpResponse.json(_payload(data));
    };
  };
};

var Response = {};
Response.Continue = _newResponse(100);
Response.SwitchingProtocols = _newResponse(101);
Response.Processing = _newResponse(102);

Response.Ok = _newResponse(200);
Response.Created = _newResponse(201);
Response.Accepted = _newResponse(202);
Response.NonAuthoritativeInformation = _newResponse(203);
Response.NoContent = _newResponse(204);
Response.ResetContent = _newResponse(205);
Response.PartialContent = _newResponse(206);
Response.MultiStatus = _newResponse(207);
Response.AlreadyReported = _newResponse(208);
Response.ImUsed = _newResponse(226);

Response.MultipleChoices = _newResponse(300);
Response.MovedPermanently = _newResponse(301);
Response.Found = _newResponse(302);
Response.SeeOther = _newResponse(303);
Response.NotModified = _newResponse(304);
Response.UseProxy = _newResponse(305);
Response.TemporaryRedirect = _newResponse(307);
Response.PermanentRedirect = _newResponse(308);

Response.BadRequest = _newResponse(400);
Response.Unauthorized = _newResponse(401);
Response.PaymentRequired = _newResponse(402);
Response.Forbidden = _newResponse(403);
Response.NotFound = _newResponse(404);
Response.MethodNotAllowed = _newResponse(405);
Response.NotAcceptable = _newResponse(406);
Response.ProxyAuthenticationRequired = _newResponse(407);
Response.RequestTimeout = _newResponse(408);
Response.Conflict = _newResponse(409);
Response.Gone = _newResponse(410);
Response.LengthRequired = _newResponse(411);
Response.PreconditionFailed = _newResponse(412);
Response.PayloadTooLarge = _newResponse(413);
Response.URITooLong = _newResponse(414);
Response.UnsupportedMediaType = _newResponse(415);
Response.RequestedRangeNotSatisfiable = _newResponse(416);
Response.ExpectationFailed = _newResponse(417);
Response.UnprocessableEntity = _newResponse(422);
Response.Locked = _newResponse(423);
Response.FailedDependency = _newResponse(424);
Response.UpgradeRequired = _newResponse(426);
Response.PreconditionRequired = _newResponse(428);
Response.TooManyRequests = _newResponse(429);
Response.RequestHeaderFieldsTooLarge = _newResponse(431);

Response.InternalServerError = _newResponse(500);
Response.NotImplemented = _newResponse(501);
Response.BadGateway = _newResponse(502);
Response.ServiceUnavailable = _newResponse(503);
Response.GatewayTimeout = _newResponse(504);
Response.HttpVersionNotSupported = _newResponse(505);
Response.VariantAlsoNegotiates = _newResponse(506);
Response.InsufficientStorage = _newResponse(507);
Response.LoopDetected = _newResponse(508);
Response.NotExtended = _newResponse(510);
Response.NetworkAuthenticationRequired = _newResponse(511);

// special combinations

Response.OkOrNotFound = function(httpResponse){
  return function(data){
    if (data === null){
      Response.NotFound(httpResponse)(data);
    } else {
      Response.Ok(httpResponse)(data);
    }
  };
};

Response.NotFoundOr = function(otherResponse){
  return function(httpResponse){
    return function(data){
      if (data === null){
        Response.NotFound(httpResponse)(data);
      } else {
        otherResponse(httpResponse)(data);
      }
    };
  };
};

Response.ReturnError = function(cases){
  return function(httpResponse){
    return function(error){
      if (cases[error.name]){
        cases[error.name](httpResponse)(error);
      } else {
        Response.InternalServerError(httpResponse)(error);
      }
    };
  };
};

module.exports = Response;
