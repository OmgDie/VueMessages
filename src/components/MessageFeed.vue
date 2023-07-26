<template>
    <div>
        <div v-for="message in messages" :key="message.id" class="message-item">
            <MessageItem :message="message" />
        </div>
        <button v-if="showLoadMoreButton" @click="loadMoreMessages">
            Загрузить еще
        </button>
    </div>
</template>

<script>
import MessageItem from "./MessageItem.vue";

export default {
    components: {
        MessageItem,
    },
    data() {
        return {
            messages: [], // Массив сообщений
            batchSize: 10, // Размер подгружаемой порции сообщений
            jsonDataUrl: "/messages.json", // Путь к моковому файлу messages.json
        };
    },
    computed: {
        showLoadMoreButton() {
            return this.messages.length >= this.batchSize;
        },
    },
    mounted() {
        // Загрузка первой порции сообщений при загрузке компонента
        this.loadMoreMessages();
    },
    methods: {
        loadMoreMessages() {
            // Имитация загрузки данных с сервера с помощью fetch
            fetch(this.jsonDataUrl)
                .then((response) => response.json())
                .then((data) => {
                    const nextBatch = data.slice(
                        this.messages.length,
                        this.messages.length + this.batchSize
                    );
                    this.messages = this.messages.concat(nextBatch);
                })
                .catch((error) => {
                    console.error("Ошибка загрузки данных:", error);
                });
        },
    },
};
</script>

<style>
.message-item {
    margin-bottom: 10px;
}
</style>
