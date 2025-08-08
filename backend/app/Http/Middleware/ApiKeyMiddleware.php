<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->header('knotapi');
        $validApiKey = '012345'; // The only valid API key

        // Check if header is missing
        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'Header missing! The required header "knotapi" is not present in the request.',
                'error' => 'HEADER_MISSING',
                'required_header' => 'knotapi'
            ], 401);
        }

        // Check if API key is invalid
        if ($apiKey !== $validApiKey) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorised! Invalid API key provided in "knotapi" header.',
                'error' => 'INVALID_API_KEY',
                'header_name' => 'knotapi'
            ], 401);
        }

        return $next($request);
    }
}