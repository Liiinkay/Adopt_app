import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Table = () => {
  return (
    <View style={styles.table}>
      {/* Encabezado de la tabla */}
      <View style={styles.rowHeader}>
        <View style={styles.cell}>
          <Text style={styles.cellText}>Columna 1</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>Columna 2</Text>
        </View>
      </View>

      {/* Filas de la tabla */}
      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.cellText}>Fila 1, Columna 1</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>Fila 1, Columna 2</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.cellText}>Fila 2, Columna 1</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>Fila 2, Columna 2</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.cellText}>Fila 3, Columna 1</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>Fila 3, Columna 2</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.cellText}>Fila 4, Columna 1</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>Fila 4, Columna 2</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.cellText}>Fila 5, Columna 1</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>Fila 5, Columna 2</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  rowHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFBFE2'
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6'
  },
  cell: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#9D9D9D',
  },
  cellText: {
    textAlign: 'center',
  },
});

export default Table;
