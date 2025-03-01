import {defineStore} from "pinia";
import {useBoardStore} from "./board.ts";


export const useLayerOrder = defineStore("layerOrder", () => {

    const boardStore = useBoardStore();

    const forwardAll = (id: string) => {
        const currentComp = boardStore.board?.components.find(c => c.id === id);
        if (!currentComp) {
            return
        }
        const otherPrios = boardStore.board?.components
            .filter(c => currentComp.type == 'postIt' ? c.type == 'postIt' : c.type != 'postIt')
            .filter(c => c !== currentComp)
            .map(c => c.priority || 0) || []
        const newPrio = Math.max(...otherPrios) + 1
        if (newPrio != currentComp.priority) {
            currentComp.priority = newPrio
            boardStore.updateComponent(currentComp)
        }
    }
    const forward = (id: string) => {
        const currentComp = boardStore.board?.components.find(c => c.id === id);
        if (!currentComp) {
            return
        }
        const otherPrios = boardStore.board?.components
            .filter(c => currentComp.type == 'postIt' ? c.type == 'postIt' : c.type != 'postIt')
            .filter(c => c !== currentComp)
            .filter(c => (c.priority || 0) <= (currentComp.priority || 0))
            .map(c => c.priority || 0) || []

        // If current prio is already the max: return after doing nothing
        if (otherPrios.length == 0)
            return

        currentComp.priority = Math.min(...otherPrios) + 1
        boardStore.updateComponent(currentComp)
    }
    const backward = (id: string) => {
        const currentComp = boardStore.board?.components.find(c => c.id === id);
        if (!currentComp) {
            return
        }
        const otherPrios = boardStore.board?.components
            .filter(c => currentComp.type == 'postIt' ? c.type == 'postIt' : c.type != 'postIt')
            .filter(c => c !== currentComp)
            .filter(c => (c.priority || 0) <= (currentComp.priority || 0))
            .map(c => c.priority || 0) || []

        // If current prio is already the max: return after doing nothing
        if (otherPrios.length == 0)
            return

        console.log(currentComp.priority, otherPrios)
        currentComp.priority = Math.max(...otherPrios) - 1
        boardStore.updateComponent(currentComp)
    }
    const backwardAll = (id: string) => {
        const currentComp = boardStore.board?.components.find(c => c.id === id);
        if (!currentComp) {
            return
        }
        const isPostit = currentComp.type == 'postIt'

        const otherPrios = boardStore.board?.components
            .filter(c => isPostit ? c.type == 'postIt' : c.type != 'postIt')
            .filter(c => c !== currentComp)
            .map(c => c.priority || 0) || []
        const newPrio = Math.min(...otherPrios) - 1
        if (newPrio != currentComp.priority) {
            currentComp.priority = newPrio
            boardStore.updateComponent(currentComp)
        }
    }

    return {
        forwardAll,
        forward,
        backward,
        backwardAll
    }
})