"use client";
import React from 'react';
import { Container, Stack, Group, Title, Button, Input, Select, Textarea, Card, Table, NavLink } from '@mantine/core';

export default function VisualStates(){
  return (
    <Container size="xl" data-testid="visual-root">
      <Stack gap="lg">
        <Title order={1}>Visual States Showcase</Title>

        <Card withBorder>
          <Stack>
            <Title order={3}>Focus-visible</Title>
            <Group>
              <Button variant="filled" data-testid="btn-filled">Filled</Button>
              <Button variant="outline" data-testid="btn-outline">Outline</Button>
              <Button variant="transparent" data-testid="btn-transparent">Transparent</Button>
              <NavLink label="رابط جانبي" data-testid="navlink" />
            </Group>
            <Group>
              <Input size="md" placeholder="Input md" data-testid="input-md" />
              <Input size="sm" placeholder="Input sm" data-testid="input-sm" />
              <Input size="lg" placeholder="Input lg" data-testid="input-lg" />
            </Group>
            <Group>
              <Select size="md" placeholder="Select md" data-testid="select-md" data={[]} />
              <Select size="sm" placeholder="Select sm" data-testid="select-sm" data={[]} />
              <Select size="lg" placeholder="Select lg" data-testid="select-lg" data={[]} />
            </Group>
            <Textarea placeholder="Textarea" data-testid="textarea" />
          </Stack>
        </Card>

        <Card withBorder data-responsive="wide" data-fit="content" data-density="compact">
          <Stack>
            <Title order={3}>Table densities</Title>
            <div className="u-scroll-x">
              <Table striped highlightOnHover withRowBorders withColumnBorders data-testid="table">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th data-cell="id">ID</Table.Th>
                    <Table.Th>Client</Table.Th>
                    <Table.Th data-cell="num">Amount</Table.Th>
                    <Table.Th data-cell="date">Date</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Table.Tr key={i}>
                      <Table.Td data-cell="id">INV-{1000 + i}</Table.Td>
                      <Table.Td>شركة مدى</Table.Td>
                      <Table.Td data-cell="num">IQD {((i+1)*12345).toLocaleString()}</Table.Td>
                      <Table.Td data-cell="date">2025-08-0{i+1}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
