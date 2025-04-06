using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Microsoft.Extensions.Options;
using AuthApp.API.Configuration;
using System.Text.Json;

namespace AuthApp.API.Services
{
    public interface IFirebaseAuthService
    {
        Task<string> VerifyTokenAsync(string idToken);
        Task<UserRecord> GetUserAsync(string uid);
        Task<UserRecord> CreateUserAsync(string email, string password);
        Task<UserRecord> UpdateUserAsync(string uid, string email, string password);
        Task DeleteUserAsync(string uid);
        Task<string> SignInWithEmailAndPasswordAsync(string email, string password);
        Task SendPasswordResetEmailAsync(string email);
    }

    public class FirebaseAuthService : IFirebaseAuthService
    {
        private readonly FirebaseApp _firebaseApp;

        public FirebaseAuthService(IOptions<FirebaseConfig> firebaseConfig)
        {
            if (FirebaseApp.DefaultInstance == null)
            {
                var config = firebaseConfig.Value;
                
                // Ensure the private key is properly formatted
                var privateKey = config.PrivateKey;
                if (!privateKey.Contains("-----BEGIN PRIVATE KEY-----"))
                {
                    privateKey = "-----BEGIN PRIVATE KEY-----\n" + privateKey;
                }
                if (!privateKey.Contains("-----END PRIVATE KEY-----"))
                {
                    privateKey = privateKey + "\n-----END PRIVATE KEY-----";
                }
                
                // Replace literal \n with actual newlines
                privateKey = privateKey.Replace("\\n", "\n");

                var credentialJson = JsonSerializer.Serialize(new
                {
                    type = "service_account",
                    project_id = config.ProjectId,
                    private_key_id = config.PrivateKeyId,
                    private_key = privateKey,
                    client_email = config.ClientEmail,
                    client_id = config.ClientId,
                    auth_uri = config.AuthUri,
                    token_uri = config.TokenUri,
                    auth_provider_x509_cert_url = config.AuthProviderX509CertUrl,
                    client_x509_cert_url = config.ClientX509CertUrl
                });

                _firebaseApp = FirebaseApp.Create(new AppOptions()
                {
                    Credential = GoogleCredential.FromJson(credentialJson)
                });
            }
            else
            {
                _firebaseApp = FirebaseApp.DefaultInstance;
            }
        }

        public async Task<string> VerifyTokenAsync(string idToken)
        {
            try
            {
                var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
                return decodedToken.Uid;
            }
            catch (Exception ex)
            {
                throw new Exception("Invalid token", ex);
            }
        }

        public async Task<UserRecord> GetUserAsync(string uid)
        {
            try
            {
                return await FirebaseAuth.DefaultInstance.GetUserAsync(uid);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting user: {ex.Message}", ex);
            }
        }

        public async Task<UserRecord> CreateUserAsync(string email, string password)
        {
            try
            {
                var userArgs = new UserRecordArgs()
                {
                    Email = email,
                    Password = password,
                    EmailVerified = false,
                    Disabled = false
                };

                return await FirebaseAuth.DefaultInstance.CreateUserAsync(userArgs);
            }
            catch (FirebaseAuthException ex)
            {
                if (ex.AuthErrorCode == AuthErrorCode.ConfigurationNotFound)
                {
                    throw new Exception("Email/Password authentication is not enabled in Firebase Console. Please enable it in the Authentication > Sign-in method section.", ex);
                }
                throw new Exception($"Error creating user: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating user: {ex.Message}", ex);
            }
        }

        public async Task<UserRecord> UpdateUserAsync(string uid, string email, string password)
        {
            try
            {
                var userArgs = new UserRecordArgs()
                {
                    Uid = uid,
                    Email = email,
                    Password = password
                };

                return await FirebaseAuth.DefaultInstance.UpdateUserAsync(userArgs);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating user: {ex.Message}", ex);
            }
        }

        public async Task DeleteUserAsync(string uid)
        {
            try
            {
                await FirebaseAuth.DefaultInstance.DeleteUserAsync(uid);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting user: {ex.Message}", ex);
            }
        }

        public async Task<string> SignInWithEmailAndPasswordAsync(string email, string password)
        {
            try
            {
                // In a real implementation, you would use Firebase Admin SDK to verify credentials
                // For now, we'll just return a mock token
                return "mock-token-" + Guid.NewGuid().ToString();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error signing in: {ex.Message}", ex);
            }
        }

        public async Task SendPasswordResetEmailAsync(string email)
        {
            try
            {
                await FirebaseAuth.DefaultInstance.GeneratePasswordResetLinkAsync(email);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error sending password reset email: {ex.Message}", ex);
            }
        }
    }
} 