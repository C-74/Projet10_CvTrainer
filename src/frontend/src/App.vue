<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-14 items-center">
          <router-link to="/" class="text-xl font-bold text-indigo-600">
            CV Trainer
          </router-link>
        </div>
      </div>
    </nav>
    <!-- Contenu principal : prend tout l'espace restant -->
    <main class="flex-1 overflow-hidden">
      <router-view />
    </main>
  </div>
</template>
