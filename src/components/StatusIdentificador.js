import { Chip } from '@material-ui/core/';
import { IDENTIFICACAO } from './constants';

export default function StatusIdentificador({ identification }) {
  console.log('identificador ', identification);
  return (
    <Chip
      label={IDENTIFICACAO[identification - 1].type}
      style={{
        background: IDENTIFICACAO[identification - 1].color,
        color: 'white',
        width: 120,
      }}
    />
  );
}
