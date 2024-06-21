import { useUniverse } from './context';
import './ui.css';

export const UI = () => {
  const { currentConstellation } = useUniverse();

  if (!currentConstellation) {
    return null;
  }

  return (
    <div id="ui">
      <div id="constellation-name">{currentConstellation.name}</div>
    </div>
  );
};
