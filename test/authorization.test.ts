import { Request, Response, NextFunction } from "express";
import { authorize } from "../src/api/v1/middleware/authorization";
import { AuthorizationError } from "../src/api/v1/errors/errors";

// Unit tests for authorization middleware
describe("Authorization middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockReq = { params: {} };
    mockRes = { locals: {} };
    mockNext = jest.fn();
  });

  test("allows access when user has proper role", () => {
    (mockRes as any).locals = { uid: "u1", role: "manager" };

    const mw = authorize({ roles: ["manager", "officer"] });
    mw(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockNext.mock.calls[0][0]).toBeUndefined();
  });

  test("denies access when user has insufficient role", () => {
    (mockRes as any).locals = { uid: "u2", role: "user" };

    const mw = authorize({ roles: ["officer"] });
    mw(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const firstArg = mockNext.mock.calls[0][0];
    expect(firstArg).toBeInstanceOf(AuthorizationError);
    expect((firstArg as unknown as AuthorizationError).message).toMatch(/Forbidden/i);
  });

  test("denies access when user has no role", () => {
    (mockRes as any).locals = { uid: "u2" }; // No role

    const mw = authorize({ roles: ["officer"] });
    mw(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const firstArg = mockNext.mock.calls[0][0];
    expect(firstArg).toBeInstanceOf(AuthorizationError);
    expect((firstArg as unknown as AuthorizationError).message).toMatch(/Forbidden/i);
  });

  test("denies access when user has wrong role for multiple roles", () => {
    (mockRes as any).locals = { uid: "u2", role: "user" };

    const mw = authorize({ roles: ["officer", "manager"] });
    mw(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const firstArg = mockNext.mock.calls[0][0];
    expect(firstArg).toBeInstanceOf(AuthorizationError);
    expect((firstArg as unknown as AuthorizationError).message).toMatch(/Forbidden/i);
  });

  test("allows same-user access when enabled", () => {
    (mockRes as any).locals = { uid: "u3", role: "user" };
    mockReq.params = { userId: "u3" };

    const mw = authorize({ roles: ["admin"], allowSameUser: true, idParam: "userId" });
    mw(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockNext.mock.calls[0][0]).toBeUndefined();
  });
});