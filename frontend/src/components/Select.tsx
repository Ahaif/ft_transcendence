import styled from 'styled-components';
interface selectType {
  select: string;
  setSelected: (e: string) => void;
}
const Sl = styled.select`
  background-color: transparent;
  font-size: 1.3rem;
  width: 30%;
  height: 100%;
  padding: 5px;
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  padding: 15px 28px;
  & option {
    &::checked {
      background-color: greenyellow !important;
    }
    background: #2c2c2c;
  }
`;
const Select = ({ select, setSelected }: selectType) => {
  return (
    <Sl onChange={(e) => setSelected(e.target.value)} value={select}>
      <option value={'easy'}>Easy</option>
      <option value={'medium'}>Medium</option>
      <option value={'hard'}>Hard</option>
    </Sl>
  );
};

export default Select;
