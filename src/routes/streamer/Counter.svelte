<script>
  import { spring } from "svelte/motion";
  import SpringedNumber from "$lib/SpringedNumber.svelte";

  let count = 0;

  const displayed_count = spring(1, { damping: 0.5, stiffness: 0.1 });
  $: displayed_count.set(count);
  $: offset = modulo($displayed_count, 1);

  /**
   * @param {number} n
   * @param {number} m
   */
  function modulo(n, m) {
    // handle negative numbers
    return ((n % m) + m) % m;
  }
</script>

<div class="counter">
  <button
    on:click={() => (count -= 1)}
    aria-label="Decrease the counter by one"
  >
    <svg aria-hidden="true" viewBox="0 0 1 1">
      <path d="M0,0.5 L1,0.5" />
    </svg>
  </button>

  <SpringedNumber {count} />

  <button
    on:click={() => (count += 1)}
    aria-label="Increase the counter by one"
  >
    <svg aria-hidden="true" viewBox="0 0 1 1">
      <path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" />
    </svg>
  </button>
</div>

<style>
  .counter {
    display: flex;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin: 1rem 0;
  }

  .counter button {
    width: 2em;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background-color: transparent;
    touch-action: manipulation;
    font-size: 2rem;
  }

  .counter button:hover {
    background-color: var(--color-bg-1);
  }

  svg {
    width: 25%;
    height: 25%;
  }

  path {
    vector-effect: non-scaling-stroke;
    stroke-width: 2px;
    stroke: #444;
  }
</style>
