import React from 'react';
import { renderScreen } from '../../screens';
import type { Screen } from '../../types';
import type { AppActions, AppData } from '../state/types';

export function renderAppScreen(screen: Screen, data: AppData, actions: AppActions) {
  return renderScreen(screen, data, actions);
}
