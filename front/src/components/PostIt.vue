<template>
  <OnClickOutside @trigger="onClickOutside">
    <div
        :class="[data.color, $attrs.class, {own, editing, 'redacted-script-regular': !data.visible && !own}]"
        :style="{ left: data.position[0] - 50 + 'px', top: data.position[1] - 40 + 'px', transition: own ? '' : 'all 0.2s ease'}"
        class="post-it"
        @mouseover="setDraggable"
        @contextmenu.prevent="showContextMenu($event)"
        @click.self.prevent="onClick"

    >
      <div :id="data.id"
           :contenteditable="own && editing"
           class="inpostit"
           @blur="onTextChange"
      >
        {{ hidetext }}
      </div>
      <div v-if="own" class="show-hide-btn" @click="handleActionClick('toggleVisible')">
        <font-awesome-icon v-if="data.visible" :icon="faFont" style=""/>
        <font-awesome-icon v-else :icon="faSignature" style=""/>
      </div>
    </div>
  </OnClickOutside>

  <ContextMenu
      v-if="showMenu"
      :actions="contextMenuActions"
      :x="menuX"
      :y="menuY"
      @action-clicked="handleActionClick"
  />

</template>

<script lang="ts" setup>
import {OnClickOutside} from '@vueuse/components'
import {PostIt} from "@retro/shared";
import {computed, ref} from "vue";
import {type Position, useDraggable} from "@vueuse/core"
import {useBoardStore} from "../stores/board.ts";
import ContextMenu from "./ContextMenu.vue";
import {useUserStore} from '../stores/users.ts';
import {faFont, faSignature} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = defineProps<{ data: PostIt, board: HTMLElement | null }>()
defineOptions({inheritAttrs: false})


const {updateComponent, deleteComponent} = useBoardStore();
const editing = ref(false)
const dragging = ref(false)
const userStore = useUserStore()
const own = ref(userStore.me?.uuid === props.data.owner)


const setDraggable = (evt: MouseEvent & { target: HTMLElement }) => {
  if (own.value && evt.target) {
    const moved = ref(false)
    useDraggable(evt.target, {
      onEnd: (position: Position, _evt: PointerEvent) => {
        if (moved.value) {
          updateComponent(props.data)
          moved.value = false
        } else {
          editing.value = true
        }
        setTimeout(() => {
          dragging.value = false
        }, 100) // Delay to prevent onClick to trigger
      },
      onStart: () => {
        dragging.value = true
        editing.value = false
      },
      onMove: (event) => {
        moved.value = true
        props.data.position = [event.x + 50, event.y + 40]
      },
      preventDefault: true,
      capture: true,
      exact: true,
      stopPropagation: true,
      containerElement: props.board,
      disabled: () => editing.value
    })
  }
}


const onClick = () => {
  console.log('onClick')
  if (!dragging.value) {
    editing.value = true
  }
}
const onTextChange = (evt: FocusEvent & { target: { innerText: string } }) => {
  if (props.data.text !== evt.target.innerText) {
    props.data.text = evt.target.innerText
    updateComponent({...props.data})
    evt.target.innerText = props.data.text // Fix duplicating text on edit
  }
  editing.value = false
}
const onClickOutside = () => {
  editing.value = false
}

const showMenu = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const contextMenuActions = computed(() => [
  {label: 'Delete', style: '', action: 'delete'},
  {label: props.data.visible ? 'Hide' : 'Show', style: '', action: 'toggleVisible'},
  {
    label: '', style: '', action: [
      {label: ' ', style: 'background-color: var(--green-post-it); width:10px; height:10px', action: 'color-green'},
      {label: ' ', style: 'background-color: var(--yellow-post-it); width:10px; height:10px', action: 'color-yellow'},
      {label: ' ', style: 'background-color: var(--orange-post-it); width:10px; height:10px', action: 'color-orange'},
      {label: ' ', style: 'background-color: var(--red-post-it); width:10px; height:10px', action: 'color-red'},
      {label: ' ', style: 'background-color: var(--blue-post-it); width:10px; height:10px', action: 'color-blue'}
    ]
  },
]);

const rot13 = (text: string) => text.split('')
    .map(char => char === ' ' ? ' ' : String.fromCharCode(char.charCodeAt(0) + (char.toLowerCase() < 'n' ? 13 : -13)))
    .join('');

const hidetext = computed(() => (!props.data.visible && !own.value) ? rot13(props.data.text) : props.data.text);


const showContextMenu = (event: PointerEvent) => {
  if (own.value) {
    event.preventDefault();
    showMenu.value = true;
    menuX.value = event.clientX;
    menuY.value = event.clientY;
  }
};

const handleActionClick = (action: string) => {
  switch (action) {
    case 'delete':
      if (props.data.id)
        deleteComponent(props.data.id)
      break;
    case 'color-green':
    case 'color-yellow':
    case 'color-orange':
    case 'color-red':
    case 'color-blue':
      props.data.color = action.split('-')[1]
      updateComponent(props.data)
      break;
    case 'toggleVisible':
      if (props.data.id) {
        props.data.visible = !props.data.visible;
        updateComponent(props.data)
      }
      break;
    default:
      break;
  }
  showMenu.value = false;
}
</script>

<style scoped>
.post-it {
  position: absolute;
  padding: .33em; /* Margin between post-it border & text = 1/4 character width */

  /* Borders */
  border: 1px solid #0004;
  margin: -1px; /* compensate for border width */

  /* Shadow */
  box-shadow: 0 5px 10px -5px #000;

}

.post-it.own {
  cursor: grab;
}

.post-it.own:hover:not(.editing) {
  border: 1px solid black;
  margin: -1px; /* compensate for border width */
}

.post-it.editing {
  border: 1px dashed var(--border-color);
  margin: -1px; /* compensate for border width */
}

.inpostit {
  width: 100px;
  min-height: 80px; /* Will elongate if too much text */
  font-size: smaller;

  /* Manage word break properly */
  overflow-wrap: break-word;
  border-radius: 1em; /* easier to dragndrop from corners */
}

.post-it.editing .inpostit[contenteditable] {
  outline: 0px solid transparent;
  cursor: text;
}

.post-it:active {
  cursor: grabbing;
}

.green {
  background-color: var(--green-post-it);
}

.yellow {
  background-color: var(--yellow-post-it);
}

.orange {
  background-color: var(--orange-post-it);
}

.red {
  background-color: var(--red-post-it);
}

.blue {
  background-color: var(--blue-post-it);
}

.post-it.user-unfocused {
  filter: blur(2px) grayscale(50%)
}

.show-hide-btn {
  padding: 5px;
  margin-bottom: -25px;
  cursor: pointer;
}
</style>