import { useEffect, useState } from 'react';
import { ScrollView, View, Text, RefreshControl } from 'react-native';
import { Productos } from '@/interfaces/interfaces';
import { Stack } from 'expo-router';
import { formatearFechaParaString } from '@/utils/formatearFecha';
import { Clock, Database, GitBranch } from 'lucide-react-native';
import { useCosultaApi } from '@/hooks/datosApi.hook';
import { ProductosDePagaB_Public, ProductosEnOfertasB_Public, ProductosGratisgaB_Public } from '@/routes/public.routes';
import { CardTienda } from '@/components/shop/card-store';
import { AppLayout } from '@/components/navigation';
import Pagination from './pagination';
import SearchBar from './search';
import { Loading } from './loading/loading';
import { NotProducts } from './not-products/not-products';

interface ShopPageProps {
    typePage: "gratis" | "pagos" | "ofertas",
    itemsPerPage: number
}

export default function ShopPage({ typePage, itemsPerPage = 10 }: ShopPageProps) {
    const { get } = useCosultaApi()
    const [productos, setProductos] = useState<Productos[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const [searchCategoria, setSearchCategoria] = useState<string>("")

    const [refreshing, setRefreshing] = useState(false);

    const fetchConsulta = async (page: number, search: string, searchCategoria: string) => {
        const { alert, data, message } = await get(`${typePage == "pagos" ? ProductosDePagaB_Public : typePage == 'ofertas' ? ProductosEnOfertasB_Public : ProductosGratisgaB_Public}?page=${page}&limit=${itemsPerPage}&search=${search}&searchCategoria=${searchCategoria}&order=desc`, { "Content-Type": "application/json", });
        setError(null);
        setLoading(false);
        setRefreshing(false);
        if (alert === "success") {
            setProductos(data.records);
            setTotalPages(data.totalPages);
            return
        }
        if (message) setError(message);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setError(null);
        await fetchConsulta(currentPage, search, searchCategoria);
    }

    useEffect(() => {
        fetchConsulta(currentPage, search, searchCategoria);

    }, [currentPage, search, searchCategoria]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
            setLoading(false);
        }
    };

    const handleSearchChange = (text: string) => {
        setSearch(text);
        setCurrentPage(1);
        setLoading(false);
    };

    const handleSearchCategoriaChange = (text: string) => {
        setSearchCategoria(text);
        setCurrentPage(1);
        setLoading(false);
    };

    const renderProductos = () => {
        if (loading) return <Loading precio={true} descuento={typePage === "ofertas"} />;
        if (error || productos.length === 0) return <NotProducts texto={error || "No se encontraron productos disponibles"} />;

        return (
            <>
                <View className="flex flex-row flex-wrap p-2 gap-4 justify-center">
                    {productos.map(producto => {
                        return (
                            <CardTienda
                                key={producto.id}
                                card={
                                    typePage == "pagos" ? {
                                        fecha_registro: producto.fecha_registro,
                                        plan: producto.plan ? producto.plan.nombre : null,
                                        id: producto.id,
                                        nombre: producto.nombre,
                                        categoria: producto.categorias.nombre,
                                        precio: String(producto.precio),
                                        descipcion: producto.descripcion,
                                        version: [
                                            {
                                                icon: GitBranch,
                                                valor: producto.versiones?.[0].numero_version
                                            },
                                            {
                                                icon: Database,
                                                valor: producto.versiones?.[0].size || ""
                                            },
                                            {
                                                icon: Clock,
                                                valor: formatearFechaParaString(producto.versiones?.[0].fecha_lanzamiento)
                                            },
                                        ]
                                    }
                                        :
                                        typePage == "ofertas" ? {
                                            fecha_registro: producto.fecha_registro,
                                            plan: producto.plan ? producto.plan.nombre : null,
                                            id: producto.id,
                                            nombre: producto.nombre,
                                            categoria: producto.categorias.nombre,
                                            precio: producto.precio.toString(),
                                            descuento: producto.productos_ofertas?.[0].ofertas.descuento.toString(),
                                            descipcion: producto.descripcion,
                                            version: [
                                                {
                                                    icon: GitBranch,
                                                    valor: producto.versiones?.[0].numero_version
                                                },
                                                {
                                                    icon: Database,
                                                    valor: producto.versiones?.[0].size || ""
                                                },
                                                {
                                                    icon: Clock,
                                                    valor: formatearFechaParaString(producto.versiones?.[0].fecha_lanzamiento)
                                                },
                                            ]
                                        } : {
                                            fecha_registro: producto.fecha_registro,
                                            plan: producto.plan ? producto.plan.nombre : null,
                                            id: producto.id,
                                            nombre: producto.nombre,
                                            categoria: producto.categorias.nombre,
                                            descipcion: producto.descripcion,
                                            version: [
                                                {
                                                    icon: GitBranch,
                                                    valor: producto.versiones?.[0].numero_version
                                                },
                                                {
                                                    icon: Database,
                                                    valor: producto.versiones?.[0].size || ""
                                                },
                                                {
                                                    icon: Clock,
                                                    valor: formatearFechaParaString(producto.versiones?.[0].fecha_lanzamiento)
                                                },
                                            ]
                                        }
                                }
                            />
                        );
                    })}
                </View>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
        );
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <AppLayout title="ConvertSystems" showBackButton={true}>
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 8 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#ff6600', '#2f25ff', '#00f326']}
                            tintColor={'#ff6600'}
                            title='Cargando...'
                            titleColor='#ff6600'
                        />
                    }
                >
                    <View
                        className="flex flex-col gap-2"
                    >
                        <SearchBar search={search} handleSearchChange={handleSearchChange} seachCategorySelect={searchCategoria} handleSearchCategory={handleSearchCategoriaChange} />
                        {renderProductos()}
                        {/* <Footer /> */}
                    </View>
                </ScrollView>
            </AppLayout >
        </>
    );
}
