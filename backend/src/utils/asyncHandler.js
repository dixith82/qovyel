// Express doesn't automatically catch rejected promises from async route
// handlers — an unhandled rejection here would leave the request hanging
// with no response. Wrap every async controller in this so errors always
// reach the centralized error handler.
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
