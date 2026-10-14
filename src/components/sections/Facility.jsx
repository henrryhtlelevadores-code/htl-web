import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FloorHeader from '../ui/FloorHeader';
import ProductCatalog from '../ui/ProductCatalog';
import { ACCESSORIES } from '../../data/content';
import { PRODUCTS } from '../../data/products';

export default function Facility() {
    return (
        <section id="facility" aria-labelledby="facility-title" className="bg-ground">
            <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 md:py-28 lg:px-10">
                <FloorHeader code="5" id="facility-title" title="Un solo proveedor para el ascensor y lo que lo rodea">
                    HTL Facility Management cuida cabinas, pisos, vidrios y áreas comunes con la línea profesional ProClean y equipamiento industrial. Elija un producto para ver sus beneficios y presentaciones.
                </FloorHeader>

                {/* The home floor shows two shelves; the whole line lives in the catalogue. */}
                <div className="mt-14">
                    <ProductCatalog limit={8}>
                        <Link to="/productos" className="btn-ghost">
                            Ver los {PRODUCTS.length} productos <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                    </ProductCatalog>
                </div>

                <div className="mt-16 border-t border-line pt-10">
                    <h3 className="text-lg font-bold">Accesorios e insumos</h3>
                    <ul className="mt-3 grid gap-x-10 gap-y-2 text-muted sm:grid-cols-2 lg:grid-cols-3">
                        {ACCESSORIES.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                </div>
            </div>
        </section>
    );
}
