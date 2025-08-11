import { useState, useEffect } from 'react';
import { 
  Box, Input, Button, VStack, Text, Image, 
  Spinner, Alert, AlertIcon, AlertTitle, AlertDescription,
  useToast, Badge, Divider
} from '@chakra-ui/react';
import { FiSearch, FiX, FiDatabase } from 'react-icons/fi';
import inventoryServerManager from '../utils/inventoryServerManager';

export const InventorySearch = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);
  const [showSugerencias, setShowSugerencias] = useState(false);
  const toast = useToast();

  const API_BASE_URL = 'http://localhost:5003/api';

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        // Asegurar que el servidor esté ejecutándose
        await inventoryServerManager.ensureServerRunning();
        
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        setServerStatus(data);
      } catch (error) {
        setServerStatus({ status: 'error', inventario_disponible: false });
        // Intentar iniciar el servidor automáticamente
        inventoryServerManager.startServerIfNeeded();
      }
    };
    
    checkServerStatus();
    
    // Verificar cada 10 segundos si el servidor está disponible
    const interval = setInterval(checkServerStatus, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Sugerencias en tiempo real
  const handleInputChange = async (value) => {
    setSearchTerm(value);
    setSearchResult(null);
    if (value.length >= 1 && serverStatus?.inventario_disponible) {
      try {
        const response = await fetch(`${API_BASE_URL}/buscar-sugerencias`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ termino: value }),
        });
        const data = await response.json();
        setSugerencias(data.sugerencias || []);
        setShowSugerencias(data.sugerencias?.length > 0);
      } catch {
        setSugerencias([]);
        setShowSugerencias(false);
      }
    } else {
      setSugerencias([]);
      setShowSugerencias(false);
    }
  };

  // Buscar por número de inventario
  const handleSearch = async (numeroInventario = null) => {
    const numero = numeroInventario || searchTerm.trim();
    if (!numero) {
      toast({ title: 'Error', description: 'Ingrese un número de inventario', status: 'error', duration: 3000, isClosable: true });
      return;
    }
    if (!serverStatus?.inventario_disponible) {
      toast({ title: 'Error', description: 'El servidor de inventario no está disponible', status: 'error', duration: 3000, isClosable: true });
      return;
    }
    setIsLoading(true);
    setSearchResult(null);
    setShowSugerencias(false);
    try {
      const response = await fetch(`${API_BASE_URL}/buscar-inventario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_inventario: numero }),
      });
      const data = await response.json();
      if (data.encontrado) {
        setSearchResult(data.objeto);
      } else {
        toast({ title: 'No encontrado', description: data.message || `No se encontró ningún objeto con el número: ${numero}`, status: 'info', duration: 4000, isClosable: true });
      }
    } catch {
      toast({ title: 'Error de conexión', description: 'No se pudo realizar la búsqueda.', status: 'error', duration: 5000, isClosable: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizado
  return (
    <>
      {/* Fondo semitransparente con estética del museo */}
      <Box 
        position="fixed" 
        top={0} 
        left={0} 
        width="100vw" 
        height="100vh" 
        bg="linear-gradient(135deg, rgba(3, 105, 161, 0.15), rgba(14, 165, 233, 0.15))" 
        backdropFilter="blur(8px)"
        zIndex={99} 
        onClick={onClose} 
      />
      <Box 
        position="fixed" 
        left="50%" 
        top="50%" 
        transform="translate(-50%, -50%)" 
        width={["95%", "520px"]} 
        bg="white" 
        p={8} 
        borderRadius="20px" 
        boxShadow="0 20px 60px rgba(3, 105, 161, 0.25), 0 0 0 1px rgba(14, 165, 233, 0.1)" 
        border="2px solid rgba(14, 165, 233, 0.2)"
        zIndex={100} 
        maxH="90vh" 
        overflowY="auto"
      >
        <Box position="absolute" top={2} right={2} zIndex={101}>
          <Button size="sm" variant="ghost" onClick={onClose} _hover={{ bg: 'gray.100' }}>✕</Button>
        </Box>
        <VStack spacing={6} align="stretch">
          {/* Encabezado estético */}
          <Box textAlign="center" position="relative">
            <Box 
              display="inline-flex" 
              alignItems="center" 
              justifyContent="center"
              width="80px" 
              height="80px" 
              borderRadius="50%" 
              bg="linear-gradient(135deg, #0369a1, #0ea5e9)"
              boxShadow="0 8px 32px rgba(3, 105, 161, 0.4), 0 0 0 3px rgba(255, 255, 255, 0.9)"
              mb={4}
              mx="auto"
            >
              <FiDatabase size={32} color="white" />
            </Box>
            <Text 
              fontSize="2xl" 
              fontWeight="bold" 
              color="#0369a1"
              mb={2}
              textShadow="0 2px 4px rgba(3, 105, 161, 0.1)"
            >
              Buscador de Inventario
            </Text>
            <Text 
              fontSize="md" 
              color="gray.600" 
              mb={2}
              maxW="400px"
              mx="auto"
            >
              Explore los <strong>357 objetos</strong> del Museo Escolar. Ingrese el número de inventario para obtener información detallada.
            </Text>
            {serverStatus && (
              <Box 
                p={4} 
                bg={serverStatus.inventario_disponible ? 'rgba(34, 197, 94, 0.1)' : 'rgba(251, 191, 36, 0.1)'}
                border={`2px solid ${serverStatus.inventario_disponible ? 'rgba(34, 197, 94, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`}
                borderRadius="12px" 
                mb={4}
                textAlign="center"
              >
                <Text 
                  fontSize="sm" 
                  fontWeight="bold" 
                  color={serverStatus.inventario_disponible ? '#16a34a' : '#d97706'}
                  mb={1}
                >
                  {serverStatus.inventario_disponible ? '✅ Inventario disponible' : '⚠️ Inventario no disponible'}
                </Text>
                <Text 
                  fontSize="xs" 
                  color="gray.600"
                >
                  {serverStatus.inventario_disponible ? `${serverStatus.total_objetos} objetos en la base de datos` : 'Verifique que el servidor esté ejecutándose'}
                </Text>
              </Box>
            )}
          </Box>
          <Box position="relative" bg="gray.50" p={6} borderRadius="15px" border="1px solid rgba(14, 165, 233, 0.1)">
            <Text fontSize="sm" fontWeight="semibold" color="#0369a1" mb={3} textAlign="center">
              🔍 Búsqueda por Número de Inventario
            </Text>
            <Box display="flex" gap={3}>
              <Box flex={1} position="relative">
                <Input
                  placeholder="Ej: 001, 47, 123..."
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  size="lg"
                  borderColor="rgba(14, 165, 233, 0.3)"
                  borderWidth="2px"
                  borderRadius="12px"
                  bg="white"
                  _hover={{ 
                    borderColor: 'rgba(14, 165, 233, 0.5)',
                    boxShadow: '0 4px 12px rgba(3, 105, 161, 0.1)'
                  }}
                  _focus={{ 
                    borderColor: '#0369a1', 
                    boxShadow: '0 0 0 3px rgba(3, 105, 161, 0.15), 0 4px 12px rgba(3, 105, 161, 0.2)'
                  }}
                  disabled={!serverStatus?.inventario_disponible}
                  autoFocus
                  fontSize="md"
                  fontWeight="medium"
                />
                {showSugerencias && sugerencias.length > 0 && (
                  <Box position="absolute" top="100%" left={0} right={0} bg="white" border="1px solid" borderColor="gray.200" borderRadius="md" boxShadow="md" zIndex={120} maxH="200px" overflowY="auto">
                    {sugerencias.map((numero, index) => (
                      <Box key={numero} p={2} cursor="pointer" _hover={{ bg: 'blue.50' }} onClick={() => { setSearchTerm(numero); setShowSugerencias(false); handleSearch(numero); }} borderBottom={index < sugerencias.length - 1 ? '1px solid' : 'none'} borderBottomColor="gray.100">
                        <Text fontSize="sm">N° {numero}</Text>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              <Button 
                colorScheme="blue" 
                onClick={() => handleSearch()} 
                isLoading={isLoading} 
                loadingText="Buscando..." 
                leftIcon={<FiSearch />} 
                disabled={!serverStatus?.inventario_disponible}
                size="lg"
                borderRadius="12px"
                bg="linear-gradient(135deg, #0369a1, #0ea5e9)"
                _hover={{
                  bg: "linear-gradient(135deg, #025a8c, #0284c7)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 25px rgba(3, 105, 161, 0.3)"
                }}
                _active={{
                  transform: "translateY(0px)"
                }}
                px={8}
                fontWeight="semibold"
                transition="all 0.2s cubic-bezier(0.2, 0, 0.1, 1)"
              >
                Buscar
              </Button>
            </Box>
          </Box>
          {/* Resultado de la búsqueda */}
          {searchResult && (
            <Box 
              mt={6} 
              p={6} 
              borderWidth="2px" 
              borderRadius="20px" 
              bg="linear-gradient(135deg, rgba(3, 105, 161, 0.05), rgba(14, 165, 233, 0.05))" 
              borderColor="rgba(14, 165, 233, 0.3)"
              boxShadow="0 8px 32px rgba(3, 105, 161, 0.15)"
              position="relative"
              overflow="hidden"
            >
              {/* Fondo decorativo */}
              <Box 
                position="absolute" 
                top="-20px" 
                right="-20px" 
                width="100px" 
                height="100px" 
                borderRadius="50%" 
                bg="rgba(14, 165, 233, 0.05)" 
                pointerEvents="none"
              />
              
              {/* Encabezado del resultado */}
              <Box display="flex" alignItems="center" gap={3} mb={4}>
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  width="50px" 
                  height="50px" 
                  borderRadius="50%" 
                  bg="linear-gradient(135deg, #0369a1, #0ea5e9)"
                  boxShadow="0 4px 12px rgba(3, 105, 161, 0.3)"
                >
                  <Text color="white" fontWeight="bold" fontSize="lg">{searchResult.numero_inventario}</Text>
                </Box>
                <Box>
                  <Badge 
                    colorScheme="blue" 
                    fontSize="xs" 
                    px={3} 
                    py={1} 
                    borderRadius="full"
                    bg="rgba(3, 105, 161, 0.1)"
                    color="#0369a1"
                    border="1px solid rgba(3, 105, 161, 0.2)"
                  >
                    N° {searchResult.numero_inventario}
                  </Badge>
                  <Text fontSize="xl" fontWeight="bold" color="#0369a1" mt={1}>
                    🏛️ Objeto del Museo Escolar
                  </Text>
                </Box>
              </Box>
              
              <Divider borderColor="rgba(14, 165, 233, 0.2)" mb={4} />
              
              <VStack align="stretch" spacing={4}>
                <Box 
                  p={4} 
                  bg="white" 
                  borderRadius="12px" 
                  border="1px solid rgba(14, 165, 233, 0.1)"
                  boxShadow="0 2px 8px rgba(3, 105, 161, 0.05)"
                >
                  <Text fontSize="sm" fontWeight="bold" color="#0369a1" mb={2} display="flex" alignItems="center" gap={2}>
                    📍 PROCEDENCIA
                  </Text>
                  <Text color="gray.700" fontSize="md" lineHeight="1.6">
                    {searchResult.procedencia}
                  </Text>
                </Box>
                
                <Box 
                  p={4} 
                  bg="white" 
                  borderRadius="12px" 
                  border="1px solid rgba(14, 165, 233, 0.1)"
                  boxShadow="0 2px 8px rgba(3, 105, 161, 0.05)"
                >
                  <Text fontSize="sm" fontWeight="bold" color="#0369a1" mb={2} display="flex" alignItems="center" gap={2}>
                    🏛️ DESCRIPCIÓN DEL OBJETO
                  </Text>
                  <Text color="gray.700" fontSize="md" lineHeight="1.6">
                    {searchResult.objeto}
                  </Text>
                </Box>
                
                {searchResult.foto && searchResult.foto !== 'No disponible' && (
                  <Box 
                    p={4} 
                    bg="white" 
                    borderRadius="12px" 
                    border="1px solid rgba(14, 165, 233, 0.1)"
                    boxShadow="0 2px 8px rgba(3, 105, 161, 0.05)"
                  >
                    <Text fontSize="sm" fontWeight="bold" color="#0369a1" mb={3} display="flex" alignItems="center" gap={2}>
                      📸 INFORMACIÓN DE FOTO
                    </Text>
                    {/* Mostrar imagen si es una ruta o nombre de archivo de imagen */}
                    {/(.jpg|.jpeg|.png|.gif|.bmp|.webp)$/i.test(searchResult.foto) ? (
                      <Box textAlign="center">
                        <Image 
                          src={"/Imagenes-Videos.Respuestas/" + searchResult.foto} 
                          alt="Foto del objeto" 
                          maxW="100%" 
                          maxH="300px"
                          borderRadius="12px" 
                          boxShadow="0 4px 12px rgba(3, 105, 161, 0.2)" 
                          border="2px solid rgba(14, 165, 233, 0.1)"
                          mx="auto"
                        />
                        <Text fontSize="xs" color="gray.500" mt={2}>{searchResult.foto}</Text>
                      </Box>
                    ) : (
                      <Text color="gray.700" fontSize="md" lineHeight="1.6">
                        {searchResult.foto}
                      </Text>
                    )}
                  </Box>
                )}
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>
    </>
  );
};

export default InventorySearch;
