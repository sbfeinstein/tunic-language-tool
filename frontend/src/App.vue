<template>
  <div id="app">
    <div class="container">
      <div class="left-pane">
        <SymbolScreen />
      </div>
      <div class="right-pane">
        <SentenceEditor />
      </div>
    </div>
  </div>
</template>

<script>
import SymbolScreen from './components/SymbolScreen.vue'
import SentenceEditor from './components/SentenceEditor.vue'

export default {
  name: 'App',
  components: {
    SymbolScreen,
    SentenceEditor
  }
}
</script>

<style>
.container {
  display: flex;
  height: 100vh;
}

.left-pane, .right-pane {
  flex: 1;
}
</style>
