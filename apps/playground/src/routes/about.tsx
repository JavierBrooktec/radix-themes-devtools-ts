import { createFileRoute } from '@tanstack/react-router'
import { Heading, Text } from '@radix-ui/themes'

export const Route = createFileRoute('/about')({
  component: () => (
    <>
      <Heading size="6">About</Heading>
      <Text color="gray" mt="2">Playground for radix-themes-devtools.</Text>
    </>
  ),
})
