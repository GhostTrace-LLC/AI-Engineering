<template>
  <main
    class="mx-auto flex h-dvh w-full max-w-6xl flex-col gap-4 overflow-hidden bg-muted/30 px-4 py-4 sm:flex-row sm:py-6"
  >
    <aside
      class="w-full shrink-0 sm:w-80 sm:self-start"
      aria-labelledby="docs-heading"
    >
      <DocumentUpload />
    </aside>
    <section class="min-h-0 w-full flex-1" aria-labelledby="chat-heading">
      <AIChat />
    </section>
  </main>
</template>