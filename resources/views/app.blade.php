<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">


        <title inertia>{{ config('app.name', 'Real State') }}</title>

        <meta name="description" content="At Real State, we make buying, selling, and renting properties simple and stress-free. Whether you're searching for your dream home, an investment opportunity, or a commercial space, our expert team is here to guide you every step of the way. Explore the best real estate listings and let us help you find the perfect place to call home.">
        <meta name="keywords" content=" buy, sell, rent, properties, real estate, dream home">
        <meta name="author" content="Nestor Salom">
        <meta name="robots" content="noindex, nofollow">

        <!-- Open Graph (para Facebook, LinkedIn, etc.) -->
        <meta property="og:title" content="Real State - Find Your Dream Home Today">
        <meta property="og:description" content="Find your dream home with Real State. Buy, sell, or rent properties with expert guidance. The best real estate deals, tailored to your needs!">
        <meta property="og:image" content="/images/page.webp">
        <meta property="og:url" content="https://realstate.com">
        <meta property="og:type" content="website">

        <!-- Twitter Cards -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Real State - Find Your Dream Home Today">
        <meta name="twitter:description" content="Find your dream home with Real State. Buy, sell, or rent properties with expert guidance. The best real estate deals, tailored to your needs!">
        <meta name="twitter:image" content="/images/page.webp">

        <!-- Security -->
        <meta name="referrer" content="no-referrer">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link rel="preconnect" href="https://unpkg.com">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/swiper@7/swiper-bundle.min.css">
        
        {{-- Favicon --}}
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Real State" />
        <link rel="manifest" href="/favicon/site.webmanifest" />


        <!-- Scripts -->
        @routes
        @viteReactRefresh
        {{-- <link rel="stylesheet" href="/css/fontawesome.css">
        <link rel="stylesheet" href="/css/templatemo-villa-agency.css">
        <link rel="stylesheet" href="/css/owl.css">
        <link rel="stylesheet" href="/css/animate.css">
        <link rel="stylesheet" href="/css/style.css"> --}}
        @vite(['resources/js/app.jsx'])
        @vite('resources/css/fontawesome.css')
        @vite('resources/css/templatemo-villa-agency.css')
        @vite('resources/css/owl.css')
        @vite('resources/css/animate.css')
        @vite('resources/css/style.css')
        @inertiaHead

    </head>
    <body class="font-sans antialiased">
        @inertia

    </body>
</html>
