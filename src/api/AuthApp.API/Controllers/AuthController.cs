using Microsoft.AspNetCore.Mvc;
using AuthApp.API.Services;
using FirebaseAdmin.Auth;

namespace AuthApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IFirebaseAuthService _firebaseAuthService;

        public AuthController(IFirebaseAuthService firebaseAuthService)
        {
            _firebaseAuthService = firebaseAuthService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var token = await _firebaseAuthService.SignInWithEmailAndPasswordAsync(request.Email, request.Password);
                return Ok(new { token, user = new { email = request.Email } });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
        }

        [HttpPost("verify-token")]
        public async Task<IActionResult> VerifyToken([FromBody] string idToken)
        {
            try
            {
                var uid = await _firebaseAuthService.VerifyTokenAsync(idToken);
                return Ok(new { uid });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var user = await _firebaseAuthService.CreateUserAsync(request.Email, request.Password);
                return Ok(new { uid = user.Uid, email = user.Email });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequest request)
        {
            try
            {
                var user = await _firebaseAuthService.UpdateUserAsync(request.Uid, request.Email, request.Password);
                return Ok(new { uid = user.Uid, email = user.Email });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{uid}")]
        public async Task<IActionResult> DeleteUser(string uid)
        {
            try
            {
                await _firebaseAuthService.DeleteUserAsync(uid);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                await _firebaseAuthService.SendPasswordResetEmailAsync(request.Email);
                return Ok(new { message = "Password reset email sent successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UpdateUserRequest
    {
        public string Uid { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string Email { get; set; }
    }
} 