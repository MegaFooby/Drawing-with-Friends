<script>
  export default{
    name: 'modal',
    methods: {
      close() {
        this.$emit('close');
      },
    },
  };
</script>
<template>
<form METHOD="POST" ACTION="http://jkorpela.fi/cgi-bin/echo.cgi">
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header class="modal-header" id="modalTitle">
          <slot name="header">Settings</slot>
          <button type="button" class="btn-close" @click="close" aria-label="Close modal">x</button>
        </header>
        <section class="modal-body" id="modalDescription">
          <slot name="body">
              <label for="username">Change Username:</label><br>
              <input type="text" id="username" name="username" value=""><br>
              <label for="newPW">Change Password:</label><br>
              <input type="text" id="newPW" name="newPW" value=""><br><br>
              <label for="newColor">Change Colour (Hex):</label><br>
              <input type="text" id="newColor" name="newColor" value=""><br><br>
          </slot>
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            <button type="submit" class="btn-close" @click="close" aria-label="Close modal">Apply</button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</form>
</template>
<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 2;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-close {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }
</style>