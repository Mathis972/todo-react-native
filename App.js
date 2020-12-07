import { StatusBar } from 'expo-status-bar';
import React, { Component, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, SafeAreaView, Button } from 'react-native';
import Notification from "./notification";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ListItem from "./ListItem";
import ListItemRO from "./ListItemRO";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavBar from "./Navbar"
import { TodoProvider } from './context/todos.context';
import { TodoContext } from './context/todos.context';

const App = () => {
  function DoneTasksScreen({ navigation }) {
    const [todos, dispatch] = useContext(TodoContext);

    //Mount from the start so it displays already ?
    useEffect(() => {
      navigation.setOptions({ tabBarBadge: list.length });
    }, [todos]);

    const list = todos.filter((v) => v.state === true)
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#efefef' }}>
        <NavBar title="Done Tasks" />

        {list.length > 0 ? (
          <ScrollView>
            {list.map((value, index) => {
              return <ListItemRO value={value} key={index}></ListItemRO>
            })

            }

          </ScrollView>
        ) : (
            <ScrollView contentContainerStyle={{ alignItems: "center", justifyContent: "center", flexGrow: 1 }}>

              <Text style={{ fontSize: 24 }}>No items in the list yet !</Text>

            </ScrollView>

          )}

      </SafeAreaView>
    );
  }
  function MainScreen({ navigation }) {
    const [todos, dispatch] = useContext(TodoContext);
    const list = todos.filter((v) => v.state === false)
    const [text, setText] = useState('');
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [displayNotification, setDisplayNotification] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    useEffect(() => {
      navigation.setOptions({ tabBarBadge: list.length });
    }, [todos]);
    //TODO Categories
    const categories = {
      "shopping": "purple",
      "tech": "blue"
    }

    //Datepicker functions
    const showDatePicker = () => {

      setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
      setDate(date);
      hideDatePicker();
    };

    const addItem = () => {
      if (text != '') {
        dispatch({
          type: "ADD_TODO",
          payload: { text: text, state: false, description: description, dueDateString: date }
        });
        setText('')
        setDescription('')
        setDate(new Date())
        textInput.clear()
        descriptionInput.clear()
      } else if (displayNotification == false) {
        setDisplayNotification(true);
        setTimeout(() => setDisplayNotification(false), 3000);
      }
    };

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#efefef' }}>
        <NavBar title="Your List" />
        {displayNotification ? <Notification></Notification> : null}

        {list.length > 0 ? (
          <ScrollView>
            {todos.map((value, index) => {
              return value.state === false && <ListItem value={value} index={index} key={index} />
            })

            }

          </ScrollView>
        ) : (
            <ScrollView contentContainerStyle={{ alignItems: "center", justifyContent: "center", flexGrow: 1 }}>

              <Text style={{ fontSize: 24 }}>No todos in the list yet !</Text>

            </ScrollView>

          )}
        <View>
          <>
            <TextInput
              style={styles.input}
              placeholder="Type your new task here!"
              maxLength={40}
              onChangeText={text => setText(text)}
              ref={input => { textInput = input }}
            />
            <TextInput
              style={styles.input}
              placeholder="A little description maybe?"
              maxLength={200}
              onChangeText={description => setDescription(description)}
              ref={input => { descriptionInput = input }}
            />
            <Button title="Show Date Picker" onPress={showDatePicker} />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <Button
              style={styles.button}
              title="Add"
              onPress={addItem}
            />
          </>

        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  function CreateTaskScreen() {
    const [todos, dispatch] = useContext(TodoContext);
    const [text, setText] = useState('');
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [displayNotification, setDisplayNotification] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


    const addItem = () => {
      if (text != '') {
        dispatch({
          type: "ADD_TODO",
          payload: { text: text, state: false, description: description, dueDateString: date }
        });
        setText('')
        setDescription('')
        setDate(new Date())
        textInput.clear()
        descriptionInput.clear()
      } else if (displayNotification == false) {
        setDisplayNotification(true);
        setTimeout(() => setDisplayNotification(false), 3000);
      }
    };

    //Datepicker functions
    const showDatePicker = () => {

      setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
      setDate(date);
      hideDatePicker();
    };
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#efefef' }}>
        <NavBar title="Add a new task !" />
        {displayNotification && <Notification />}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TextInput
            style={styles.input}
            placeholder="Type your new task here!"
            maxLength={40}
            onChangeText={text => setText(text)}
            ref={input => { textInput = input }}
          />
          <TextInput
            style={styles.input}
            placeholder="A little description maybe?"
            maxLength={200}
            onChangeText={description => setDescription(description)}
            ref={input => { descriptionInput = input }}
          />
          <Button title="Show Date Picker" onPress={showDatePicker} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <Button
            style={styles.button}
            title="Add"
            onPress={addItem}
          />
        </View>
      </SafeAreaView>
    );
  }
  const Tab = createBottomTabNavigator();
  return (
    <TodoProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Todo Tasks') {
                iconName = 'ios-time'
              } else if (route.name === 'CreateTask') {
                iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
              } else if (route.name === 'DoneTasks') {
                iconName = focused ? 'ios-checkmark-circle' : 'ios-checkmark-circle-outline';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'red',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Todo Tasks" component={MainScreen} />
          <Tab.Screen name="DoneTasks" component={DoneTasksScreen} options={{ title: 'Done Tasks' }} />
          <Tab.Screen name="CreateTask" component={CreateTaskScreen} options={{ title: 'Create Task' }} />

        </Tab.Navigator>
      </NavigationContainer>
    </TodoProvider>
  );
}


const styles = StyleSheet.create({

  // Donnez le style que vous souhaitez Ã  vos composant

  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  item: {
    margin: 5,
    padding: 5,
    borderLeftWidth: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: "wrap",
    alignItems: "center"
  },
  success: {
    borderLeftColor: 'green',
  },
  edit: {
    borderLeftColor: 'orange',
  },
  todo: {
    borderLeftColor: 'red',
  },
  button: {
    borderColor: 'red',
    borderWidth: 1
  },

  buttonSuccess: {
    borderColor: 'green',
    borderWidth: 1
  },
  input: {
    fontSize: 24,
    textAlign: "center"
  },
  date: {
    fontSize: 14,
    flex: 0.3
  }
});
export default App;
