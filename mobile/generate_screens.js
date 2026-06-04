const fs = require('fs');
const path = require('path');

const screens = {
  auth: ['LoginScreen', 'RegisterScreen', 'SplashScreen', 'OnboardingScreen'],
  client: ['ClientDashboardScreen', 'LayananScreen', 'BookingScreen', 'EventSayaScreen', 'DetailEventClientScreen', 'InvoiceScreen', 'NotifikasiClientScreen', 'ProfileClientScreen'],
  crew: ['CrewDashboardScreen', 'TugasSayaScreen', 'DetailTugasScreen', 'CheckInScreen', 'DokumentasiScreen', 'RiwayatTugasScreen', 'NotifikasiCrewScreen', 'ProfileCrewScreen']
};

for (const [folder, files] of Object.entries(screens)) {
  for (const file of files) {
    const filePath = path.join(__dirname, 'src', 'screens', folder, `${file}.tsx`);
    const content = `import React from 'react';
import { View, Text } from 'react-native';

export const ${file} = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-black font-bold text-lg">${file}</Text>
    </View>
  );
};
`;
    fs.writeFileSync(filePath, content);
  }
}
console.log('Screens generated successfully.');
