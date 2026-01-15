import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Sneaker } from '../types';
import { identifySneaker } from '../services/geminiService';

interface AddSneakerViewProps {
  onSave: (sneaker: Sneaker) => void;
  onCancel: () => void;
  initialModel?: string;
  initialSneaker?: Sneaker | null;
}

const AddSneakerView: React.FC<AddSneakerViewProps> = ({ onSave, onCancel, initialModel = '', initialSneaker }) => {
  const [image, setImage] = useState<string | null>(null);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState(initialModel);
  const [colorway, setColorway] = useState('');
  const [size, setSize] = useState<string>('10');
  const [price, setPrice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialSneaker) {
        setBrand(initialSneaker.brand);
        setModel(initialSneaker.model);
        setColorway(initialSneaker.colorway);
        setSize(initialSneaker.size.toString());
        setPrice(initialSneaker.price ? initialSneaker.price.toString() : '');
        setImage(initialSneaker.image || null);
    } else if (initialModel) {
        setModel(initialModel);
    }
  }, [initialSneaker, initialModel]);

  const pickImage = async () => {
    // Ask for permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to photos to add a sneaker.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const base64Img = `data:image/jpeg;base64,${asset.base64}`;
      setImage(base64Img);
      
      // Auto-identify if brand/model empty
      if (!brand && !model) {
        identifyImage(base64Img);
      }
    }
  };

  const identifyImage = async (base64Data: string) => {
    setLoading(true);
    try {
        const result = await identifySneaker(base64Data, "");
        if (result) {
            setBrand(result.brand);
            setModel(result.model);
            setColorway(result.colorway);
            if (result.estimatedPrice) setPrice(result.estimatedPrice.toString());
        }
    } catch (e) {
        Alert.alert("AI Identification Failed", "Could not identify the sneaker. Please enter details manually.");
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!brand || !model) {
      Alert.alert("Missing Info", "Brand and Model are required.");
      return;
    }

    const newSneaker: Sneaker = {
      id: initialSneaker ? initialSneaker.id : Date.now().toString(),
      brand,
      model,
      colorway,
      size: parseFloat(size),
      price: price ? parseFloat(price) : undefined,
      image: image || undefined,
      condition: 'Deadstock',
      addedDate: initialSneaker ? initialSneaker.addedDate : new Date().toISOString()
    };

    onSave(newSneaker);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{initialSneaker ? 'Edit Sneaker' : 'Add to Vault'}</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.cameraIcon}>📷</Text>
            <Text style={styles.uploadText}>Tap to add photo</Text>
          </View>
        )}
        {loading && (
            <View style={styles.loaderOverlay}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loadingText}>AI Identifying...</Text>
            </View>
        )}
      </TouchableOpacity>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Brand</Text>
            <TextInput 
                style={styles.input}
                value={brand}
                onChangeText={setBrand}
                placeholder="Nike, Adidas..."
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Model</Text>
            <TextInput 
                style={styles.input}
                value={model}
                onChangeText={setModel}
                placeholder="Air Jordan 1..."
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Colorway</Text>
            <TextInput 
                style={styles.input}
                value={colorway}
                onChangeText={setColorway}
                placeholder="Chicago, Bred..."
            />
        </View>

        <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Size (US)</Text>
                <TextInput 
                    style={styles.input}
                    value={size}
                    onChangeText={setSize}
                    keyboardType="numeric"
                />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Price ($)</Text>
                <TextInput 
                    style={styles.input}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    placeholder="Optional"
                />
            </View>
        </View>

        <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>{initialSneaker ? 'Update' : 'Save'}</Text>
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: 10,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
  },
  form: {
    gap: 15,
    paddingBottom: 40,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#000',
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  }
});

export default AddSneakerView;
