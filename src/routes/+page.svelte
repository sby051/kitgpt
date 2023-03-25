<script lang="ts">
    import { onlineStore } from "svelte-legos";
    import type { ActionData } from "./$types";
	import { fly, fade } from "svelte/transition";
    import { backInOut } from "svelte/easing";
	import { enhance } from "$app/forms";
    import { loadingAction } from "svelte-legos";

    export let form: ActionData;

    let entries = [] as ActionData[];

    $: entries = !!form ? [...entries, form] : entries;

    const online = onlineStore();

    let currentPrompt = "";
</script>

<main class="md:max-h-[50%] h-screen gap-4 w-full md:max-w-[30rem] relative md:border-2 border-stone-800 rounded-lg h-1/2">

    {#if !$online}
        <div transition:fade class="gap-4 absolute p-8 bg-stone-900/80 z-50 w-full h-full flex flex-col items-center justify-center">
            <span class="text-4xl font-bold text-stone-100">
                You're offline!
            </span>
            <span class="text-sm text-stone-400 text-center">
                Sadly you can't ask the Magic 8 Ball while offline.
            </span>
        </div>
    {/if}

    <div class="h-full overflow-x-hidden overflow-y-scroll px-8 pt-8 pb-24 flex flex-col gap-3 flex-end">
        {#if entries.length > 0}
            {#each entries as entry (entry.uid)}
                {@const timestamp = new Date(entry.timestamp).toLocaleString().replace(", ", " @ ")}
                <div transition:fly|local={{duration: 200, easing: backInOut, x: 20}} class="flex flex-col items-end relative">
                    <span class="absolute rounded-full -right-2 bottom-4 w-2 h-2 -rotate-[30deg] bg-stone-800"></span>

                    <span class="bg-stone-800 rounded-lg p-3 text-sm text-stone-100">
                        {entry.prompt}
                    </span>
                    <span class="text-xs text-stone-500 mt-1">
                        {timestamp}
                    </span>
                </div>

                <div transition:fly|local={{easing: backInOut, x: -20, delay: 600}} class="flex flex-col items-start relative">
                    <span class="absolute rounded-full -left-2 bottom-4 w-2 h-2 -rotate-[30deg] bg-violet-500"></span>

                    <span class="bg-violet-500 rounded-lg p-3 text-sm text-violet-100">
                        {entry.generated}
                    </span>
                    <span class="text-xs text-violet-500/80 mt-1">
                        {timestamp}
                    </span>
                </div>
            {/each}
        {:else}
            <div class="flex flex-col items-center justify-center h-full">
                <span class="text-2xl font-semibold text-stone-100">
                    Ask the Magic 8 Ball
                </span>
                <span class="text-sm text-stone-500 mt-2">
                    Enter a question and click "Ask"
                </span>
            </div>
        {/if}
    </div>

    <form 
        method="POST" 
        use:enhance
        class="absolute bg-stone-900/95 backdrop-blur-lg bottom-0 left-0 w-full"
    >
        <div class="p-4 flex gap-2 w-full">
            <input bind:value={currentPrompt} placeholder="Ask me anything..." name="prompt" type="text" class="transition focus:outline-none focus:ring-2 ring-violet-400 w-full text-sm rounded-lg bg-stone-800 px-4 py-3" />
            <button type="submit" class=" text-sm bg-violet-500 text-violet-100 rounded-lg px-4">
                Ask
            </button>
            <button type="button" on:click={() => entries = []} class=" text-sm bg-red-500 text-red-100 rounded-lg px-4">
                Reset
            </button>
        </div>
    </form>
</main>