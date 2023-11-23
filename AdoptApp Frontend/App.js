import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';
import { AuthProvider } from './src/contexts/AuthProvider';
import { PostProvider } from './src/contexts/PostProvider';
import { UserProvider } from './src/contexts/UserProvider';
import { QuestionProvider } from './src/contexts/QuestionProvider';
import { CommentsProvider } from './src/contexts/CommentProvider';
import RootNavigator from './src/navigation/RootNav';

export default function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <PostProvider>
          <UserProvider>
            <QuestionProvider>
              <CommentsProvider>
                <NavigationContainer>
                    <RootNavigator />
                </NavigationContainer>
              </CommentsProvider>
            </QuestionProvider>
          </UserProvider>
        </PostProvider>
      </MenuProvider>
    </AuthProvider>
  );
}
