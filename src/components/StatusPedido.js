import { Chip } from '@material-ui/core/';
import { COLOR_STATUS_PEDIDO, LABEL_STATUS } from './constants';

export default function StatusPedido({ status }) {
  return (
    <Chip
      label={LABEL_STATUS[status]}
      style={{
        backgroundColor: COLOR_STATUS_PEDIDO[status],
        color: 'white',
        width: 110,
      }}
    />
  );
}
