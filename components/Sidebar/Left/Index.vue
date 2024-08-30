<template>
  <div class="h-screen flex flex-col">
    <div
      class="
        p-2
        my-2
        hover:bg-blue-50
        dark:hover:bg-white/20
        hover:rounded-full
        w-min
      "
      :class="defaultTransition"
    >
      <nuxt-link to="/">
        <div class="w-8 h-8">
          <LogoTwitter />
        </div>
      </nuxt-link>
    </div>
    <div class="mt-2 space-y-3">
      <SidebarLeftTab v-for="item in tabList" :key="item.name">
        <template v-slot:icon>
          <component :is="item.icon"/>
        </template>
        <template v-slot:name>
          {{ item.name }}
        </template>
      </SidebarLeftTab>

      <div class="hidden xl:block">
        <UIButton liquid size="lg">
          <span class="font-bold">
            Tweet
          </span>
        </UIButton>
      </div>

      <div class="block xl:hidden">
        <UIButton>
          <div class="w-6 h-6 font-bold">
            <PencilIcon/>
          </div>
        </UIButton>
      </div>

    </div>
  </div>
</template>

<script setup>
import { HomeIcon } from "@heroicons/vue/solid"
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  DocumentTextIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  PencilIcon
} from "@heroicons/vue/outline"
const { defaultTransition } = useTailwindConfig

const tabList = ref([
  { name: 'Home', icon: HomeIcon },
  { name: 'Explore', icon: HashtagIcon },
  { name: 'Notifications', icon: BellIcon },
  { name: 'Messages', icon: InboxIcon },
  { name: 'Bookmark', icon: BookmarkIcon },
  { name: 'Lists', icon: DocumentTextIcon },
  { name: 'Profile', icon: UserIcon },
  { name: 'More', icon: DotsCircleHorizontalIcon }
])
</script>
