import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import dropdown from '../../../assets/drop-down.png';
import { CollectInputStylesVariant, IListItem } from '../../utils/constants';

interface IDropdownProps {
  listData: IListItem[];
  setSelectedValue: (e: any) => void;
  inputStyles?: CollectInputStylesVariant;
}

const Dropdown: React.FC<IDropdownProps> = (props: IDropdownProps) => {

  const screenWidth = Dimensions.get('window').width;

  const [showlist, setShowlist] = useState(false);

  const dropdownRef = React.useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const showDropdown = () => {
    dropdownRef.current.measure((fx, fy, width, height, px, py) => {
      const dropdownWidth = 200;
      let newLeft = px;
      if (px + dropdownWidth > screenWidth) {
        newLeft = screenWidth - dropdownWidth;
      }
      setDropdownPosition({ top: py + height, left: newLeft });
    });
    setShowlist(!showlist);
  };

  return (
    <SafeAreaView>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={{...styles.dropdownIcon, ...props?.inputStyles?.dropdownIcon}}
          onPress={() => showDropdown()}
          ref={dropdownRef}
          testID="dropdown-icon"
        >
          <Image source={dropdown} alt="dropdown-icon" />
        </TouchableOpacity>
        <Modal
          transparent={true}
          visible={showlist}
          animationType="fade"
          onRequestClose={() => setShowlist(false)}
          testID='modal'
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setShowlist(false);
            }}
            testID='modal-close'
          >
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>

          <View
            style={{
              ...styles.modalContent,
              ...styles.listContainer,
              top: props?.inputStyles?.dropdown?.top ?? dropdownPosition.top,
              left: props?.inputStyles?.dropdown?.left ?? dropdownPosition.left,
              ...props?.inputStyles?.dropdown,
            }}
          >
            {props?.listData?.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  ...styles.listItem,
                  borderBottomWidth: index < props?.listData.length - 1 ? 1 : 0,
                  ...props?.inputStyles?.dropdownListItem
                }}
                onPress={() => {
                  props.setSelectedValue(item);
                  setShowlist(false);
                }}
                testID='list-item'
              >
                <Text style={styles.listItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    position: 'absolute',
    width: '45%',
  },
  listContainer: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: '#ccc',
  },
  listItemText: {
    fontSize: 16,
  },
  dropdownIcon: {
    paddingTop: 14,
  },
});

export default Dropdown;