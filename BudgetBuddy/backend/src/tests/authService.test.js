// Mock dependencies
jest.mock('../services/userService');
jest.mock('../utils/jwtUtil');
jest.mock('bcryptjs');

const authService = require('../services/authService');
const userService = require('../services/userService');
const jwtUtil = require('../utils/jwtUtil');
const bcrypt = require('bcryptjs');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('registers a new user', async () => {
    const newUser = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      userID: 1,
      userType: 'Client'
    };

    userService.createUser.mockResolvedValue(1); 
    userService.findUserByID.mockResolvedValue(newUser);

    const mockToken = 'test-token-123';
    jwtUtil.generateToken.mockReturnValue(mockToken);

    const result = await authService.registerUser(newUser.email, newUser.username, newUser.password);
    
    expect(result.token).toBe(mockToken);
    expect(userService.createUser).toHaveBeenCalledWith(newUser.email, newUser.username, newUser.password);
    expect(userService.findUserByID).toHaveBeenCalledWith(1);
    expect(jwtUtil.generateToken).toHaveBeenCalledWith(newUser.userID, newUser.userType);
  });

  test('logs in a user with valid credentials', async () => {
    const mockUser = {
      userID: 1,
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashedPassword',
      userType: 'Client'
    };

    userService.findUser.mockResolvedValue(mockUser);

    bcrypt.compare.mockResolvedValue(true);

    const mockToken = 'test-token-123';
    jwtUtil.generateToken.mockReturnValue(mockToken);

    const result = await authService.loginUser('test@example.com', 'password123');
    
    expect(result.token).toBe(mockToken);
    expect(userService.findUser).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
    expect(jwtUtil.generateToken).toHaveBeenCalledWith(mockUser.userID, mockUser.userType);
  });

  test('handles invalid login credentials - user not found', async () => {
    userService.findUser.mockResolvedValue(null);

    await expect(authService.loginUser('wrong@example.com', 'wrongpassword'))
      .rejects
      .toThrow('Invalid email/username or password');
    
    expect(userService.findUser).toHaveBeenCalledWith('wrong@example.com');
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwtUtil.generateToken).not.toHaveBeenCalled();
  });

  test('handles invalid login credentials - wrong password', async () => {
    const mockUser = {
      userID: 1,
      email: 'test@example.com',
      password: 'hashedPassword'
    };

    userService.findUser.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(authService.loginUser('test@example.com', 'wrongpassword'))
      .rejects
      .toThrow('Invalid email/username or password');
    
    expect(userService.findUser).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockUser.password);
    expect(jwtUtil.generateToken).not.toHaveBeenCalled();
  });

  test('handles database error during login', async () => {
    const dbError = new Error('Database error');
    userService.findUser.mockRejectedValue(dbError);

    await expect(authService.loginUser('test@example.com', 'password123'))
      .rejects
      .toThrow('Database error');
    
    expect(userService.findUser).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwtUtil.generateToken).not.toHaveBeenCalled();
  });

  test('handles database error during registration', async () => {
    const dbError = new Error('Database error');
    userService.createUser.mockRejectedValue(dbError);

    await expect(authService.registerUser('test@example.com', 'testuser', 'password123'))
      .rejects
      .toThrow('Database error');
    
    expect(userService.createUser).toHaveBeenCalledWith('test@example.com', 'testuser', 'password123');
    expect(userService.findUserByID).not.toHaveBeenCalled();
    expect(jwtUtil.generateToken).not.toHaveBeenCalled();
  });
});
