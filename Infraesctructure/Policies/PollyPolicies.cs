using Polly;
using Polly.Extensions.Http;

namespace Cavex.Principal.Infraesctructure.Policies
{
    public static class PollyPolicies
    {
        public static IAsyncPolicy<HttpResponseMessage> RetryPolicy()
        {
            return HttpPolicyExtensions
                .HandleTransientHttpError()
                .WaitAndRetryAsync(
                    3,
                    retryAttempt =>
                        TimeSpan.FromSeconds(
                            Math.Pow(2, retryAttempt)));
        }

        public static IAsyncPolicy<HttpResponseMessage> TimeoutPolicy()
        {
            return Policy.TimeoutAsync<HttpResponseMessage>(
                TimeSpan.FromSeconds(30));
        }
    
    }
}
