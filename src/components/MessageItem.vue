<template>
    <div>
        <div class="message-header">
            {{ formatDate(message.date) }} /
            <span style="color: brown">{{ message.authorName }}</span> /
            <a :href="message.authorUrl" target="_blank">{{ message.authorUrl }}</a>
        </div>
        <div class="message-content">
            <span
                v-for="chunk in renderProcessedMessageWithSpaces(
                    message.content
                )"
                :key="chunk.text"
                :style="chunk.style"
            >
                {{ chunk.text }}
            </span>
        </div>
        <hr />
    </div>
</template>

<script>
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { interpolateColor } from "../interpolation";

export default {
    props: {
        message: {
            type: Object,
            required: true,
        },
    },
    methods: {
        getToneStyle(toneData) {
            const tone = toneData.tone;
            const redColor = "255, 0, 0";
            const yellowColor = "255, 255, 0";
            const greenColor = "0, 255, 0";

            let color;
            let t;

            if (Number.isInteger(tone)) {
                if (tone === -1) {
                    color = redColor;
                } else if (tone === 0) {
                    color = yellowColor;
                } else {
                    color = greenColor;
                }
            } else {
                // Для дробных значений тона выполняем интерполяцию между красным, желтым и зеленым.
                t = (tone + 1) / 2;
                if (t <= 0.5) {
                    color = interpolateColor(t * 2, redColor, yellowColor);
                } else {
                    color = interpolateColor(
                        (t - 0.5) * 2,
                        yellowColor,
                        greenColor
                    );
                }
            }

            return {
                background: `linear-gradient(to right, rgb(${color}), transparent)`,
            };
        },

        formatDate(date) {
            return format(new Date(date), "HH:mm, d MMMM yyyy 'г.'", {
                locale: ru,
            });
        },
        renderProcessedMessageWithSpaces(content) {
            return this.renderMessageWithColor(
                this.processContentWithSpaces(content)
            ); // Обрабатывать контент только один раз
        },
        renderMessageWithColor(message) {
            const content = message; 
            const tones = this.message.contentPostTones;

            if (!tones || !Array.isArray(tones)) {
                // Если tone не определен или не является массивом, вернуть пустой список
                return [{ text: content, style: {} }];
            }

            let lastIndex = 0;
            const chunks = [];
            for (const toneData of tones) {
                const { position, length } = toneData;
                chunks.push({
                    text: content.slice(lastIndex, position),
                    style: {},
                });
                chunks.push({
                    text: content.slice(position, position + length),
                    style: this.getToneStyle(toneData),
                });
                lastIndex = position + length;
            }
            chunks.push({ text: content.slice(lastIndex), style: {} });
            return chunks;
        },

        //С помощью регулярки заменяем переносы строк на пробелы, когда между переносами строк и символами стоят непробельные символы
        processContentWithSpaces(content) {
            return content.replace(/([^ ]) *\n *([^ ])/g, "$1 $2");
        },
    },
};
</script>

<style>

.message-header {
    font-weight: bold;
    font-size: 14px;
}

.message-content {
    padding-top: 10px;
}

.message-content span {
    white-space: pre-wrap;
}
</style>
