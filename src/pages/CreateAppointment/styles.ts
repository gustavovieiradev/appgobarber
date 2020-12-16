import { FlatList, RectButton } from 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import styled from 'styled-components/native';

import { Provider } from './index';

interface ProviderContainerProps {
  selected: boolean;
}

interface ProviderNameProps {
  selected: boolean;
}

interface HourProps {
  available: boolean;
  selected: boolean;
}

interface HourTextProps {
  selected: boolean;
}

export const Container = styled.View`
  flex: 1;  
`;

export const Content = styled.ScrollView``;

export const Header = styled.View`
  padding: 24px;
  padding-top: ${getStatusBarHeight() + 24}px;
  background: #28262e;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BackButton = styled.TouchableOpacity`

`;

export const HeaderTitle = styled.Text`
  color: #f5ede8;
  font-family: 'RobotoSlab-Medium';
  font-size: 20px;
  margin-left: 16px;
`;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  margin-left: auto;
`;

export const ProviderListContainer = styled.View`
  height: 112px;
`;

export const ProviderList = styled(FlatList as new () => FlatList<Provider>)`
  padding: 32px 24px;
`;

export const ProviderContainer = styled(RectButton)<ProviderContainerProps>`
  background: ${props => (props.selected ? '#ff9000' : '#3e3b47')};
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  margin-right: 16px;
  border-radius: 10px;
`;

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: #fff;
`;

export const ProviderName = styled.Text<ProviderContainerProps>`
  margin-left: 8px;
  font-family: 'RobotoSlab-Medium';
  font-size: 16px;
  color: ${props => (props.selected ? '#232129' : '#f4ede8')};
`;

export const CalendarContainer = styled.View`
  padding: 10px;
`;

export const CalendarTitle = styled.Text`
  padding: 0 10px;
  margin-bottom: 10px;
  color: #F4EDE8;
  font-family: 'RobotoSlab-Medium';
  font-size: 25px;  
`;

export const ScheduleContainer = styled.View`
  padding: 10px;
`;

export const ScheduleTitle = styled.Text`
  padding: 0 10px;
  margin-bottom: 10px;
  color: #F4EDE8;
  font-family: 'RobotoSlab-Medium';
  font-size: 25px;  
`;

export const ScheduleButtonContainer = styled.View`
  padding: 24px;
`;

export const ScheduleButton = styled(RectButton)`
  width: 100%;
  display: flex;
  background: #ff9000;
  align-items: center;
  justify-content: center;
  height: 50px;
  border-radius: 10px;
  margin-bottom: 24px;
`;

export const ScheduleButtonText = styled.Text`
  color: #312E38;
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
`;

export const Section = styled.View`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  margin: 0 24px 12px;
`;

export const SectionContent = styled.ScrollView.attrs({
  contentContainerStyle: {paddingHorizontal: 24},
  horizontal: true,
  showsHorizontalScrollIndicator: false
})``;

export const Hour = styled(RectButton)<HourProps>`
  padding: 12px;
  background: ${props => props.selected ? '#ff9000' : '#3e3b47'};
  border-radius: 10px;
  margin-right: 8px;

  opacity: ${(props) => (props.available ? 1 : 0.3)};
`;

export const HourText = styled.Text<HourTextProps>`
  color: ${props => props.selected ? '#232129' : '#f4ede8'};
  font-family: 'RobotoSlab-Regular';
  font-size: 16px;
`;