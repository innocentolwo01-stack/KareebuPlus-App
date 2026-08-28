import React from 'react';
import { Text, View } from 'react-native';

export type KareebuWidgetDocument = {
  id: string;
  feature: string;
  version: number;
  widgets: Array<{ id: string; type: string; payload?: unknown }>;
};

export type KareebuWidgetRenderer = (widget: KareebuWidgetDocument['widgets'][number]) => React.ReactNode;

export function renderWidgetDocument(document: KareebuWidgetDocument, render: KareebuWidgetRenderer) {
  return document.widgets.map((widget) => <React.Fragment key={widget.id}>{render(widget)}</React.Fragment>);
}

export function UnknownWidget({ type }: { type: string }) {
  if (!__DEV__) return null;
  return <View style={{ padding: 12 }}><Text>Unsupported Kareebu widget: {type}</Text></View>;
}
