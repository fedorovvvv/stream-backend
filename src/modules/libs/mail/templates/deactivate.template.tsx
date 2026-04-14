/* eslint-disable prettier/prettier */
import {
    Body,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components'
import { SessionMetadata } from '@/src/shared/types/session-metadata.type';
import * as React from 'react';

interface DeactivateTemplateProps {
    token: string
    metadata: SessionMetadata
}

export function DeactivateTemplate({ token, metadata }: DeactivateTemplateProps) {
    return (
        <Html>
            <Head />
            <Preview>Деактивация аккаунта</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className='text-center mb-8'>
                        <Heading className='text-3xl text-black font-bold'>
                            Запрос на деактивацию аккаунта
                        </Heading>
                        <Text className='text-base text-black mt-2'>
                             Вы инициировали процесс деактивации вашего аккаунта на платформе <b>TeaStream</b>
                        </Text>
                    </Section>

                    <Section className='bg-gray-100 rounded-lg p-6 text-center mb-6'>
                        <Heading className='text-2xl text-black font-semibold'>
                            Код подтверждения:
                        </Heading>
                        <Heading className='text-3xl text-black font-semibold'>
                            {token}
                        </Heading>
                        <Text className='text-black'>
                            Этот код действителен в течение 5 минут.
                        </Text>
                    </Section>

                    <Section className='bg-gray-100 rounded-lg p-6 mb-6'>
                        <Heading className='text-xl font-semibold text-[#18B9AE]'>
                            Информация о запросе:
                        </Heading>
                        <ul className='list-disc list-inside text-black mt-2'>
                            <li>🌏 Расположение: {metadata.location.country}, {metadata.location.city}</li>
                            <li>📱 Операционная система: {metadata.device.os}</li>
                            <li>🌐 Браузер: {metadata.device.browser}</li>
                            <li>💻 IP-адрес: {metadata.ip}</li>
                        </ul>
                        <Text className='text-grat-600 mt-2'>
                            Если вы не инициировали этот запрос, просто проигнорируйте это письмо.
                        </Text>
                    </Section>
                    <Section className='text-center mt-8'>
                        <Text className='text-gray-600'>
                            Если у вас есть вопросы или вы столкнулись с трудностями, не стесняйтесь обращаться в нашу службу поддержки по адресу{' '}
                            <Link
                                href='mailto:support@teastream.com'
                                className='text-[#18b9ae] underline'
                            >
                                support@teastream.com
                            </Link>
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}
